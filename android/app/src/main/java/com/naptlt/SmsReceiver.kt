package com.naptlt

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.util.Log
import com.facebook.react.HeadlessJsTaskService
import com.google.gson.Gson

class SmsReceiver: BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action.equals("android.provider.Telephony.SMS_RECEIVED")) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            if (messages.isNotEmpty()) {
                val sms = messages[0] ?: return
                val rnIntent = Intent(context, RNNotificationListenerHeadlessTask::class.java)
                val gson = Gson()
                rnIntent.putExtra("sms", gson.toJson(
                    RNSMS().apply {
                        this.messageBody = sms.messageBody
                        this.messageAddress = sms.originatingAddress
                        this.messageDate = sms.timestampMillis.toString()
                    }
                ))
                HeadlessJsTaskService.acquireWakeLockNow(context)
                context.startService(rnIntent)
            }
        }
    }
}

class RNSMS {
    var messageBody: String? = null
    var messageAddress: String? = null
    var messageDate: String? = null
}