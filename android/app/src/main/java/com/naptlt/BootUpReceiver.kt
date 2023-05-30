package com.naptlt

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootUpReceiver: BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) return
        context.startService(Intent(context, RNNotificationListener::class.java))
    }

}