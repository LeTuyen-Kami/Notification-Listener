package com.naptlt
import android.content.pm.PackageManager
import android.database.Cursor
import android.net.Uri
import android.provider.Telephony
import android.util.Log
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.google.gson.Gson
import org.json.JSONArray
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale


class UtilsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private fun getDateFromTimestamp(timestamp: String): String {

        val date = Date(timestamp.toLong())
        val dateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
        return dateFormat.format(date)
    }

    @ReactMethod
    fun getAppList(promise: Promise) {
        val packageManager = reactApplicationContext.packageManager
        val appList = AppList()
        val apps = appList.getAppList(packageManager)
        //json stringfy the list
        promise.resolve(JSONArray(apps).toString())
    }

    @ReactMethod
    fun requestSMSReceiverPermission(promise: Promise) {
        val permission = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            ContextCompat.checkSelfPermission(reactApplicationContext, android.Manifest.permission.RECEIVE_SMS) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }

        Log.d("UtilsModule", "requestSMSReceiverPermission ${permission}")

        if (!permission) {
            ActivityCompat.requestPermissions(reactApplicationContext.currentActivity!!, arrayOf(android.Manifest.permission.RECEIVE_SMS), 123)
            return
        }
        promise.resolve(true)
    }


    @ReactMethod
    fun getSmsList(dateTime: String,promise: Promise) {
        //get day from dateTime
        val day = getDateFromTimestamp(dateTime)
        var stop = false
        val permission = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
            ContextCompat.checkSelfPermission(reactApplicationContext, android.Manifest.permission.READ_SMS) == PackageManager.PERMISSION_GRANTED
        } else {
            true
        }

        if (!permission) {
            ActivityCompat.requestPermissions(reactApplicationContext.currentActivity!!, arrayOf(android.Manifest.permission.READ_SMS), 1)
            return
        }

        val smsList = ArrayList<Sms>()

        val contentResolver = reactApplicationContext.contentResolver
        val uri: Uri = Uri.parse("content://sms/inbox")

        val cursor: Cursor? = contentResolver.query(uri, null, null, null, null)
        if (cursor != null && cursor.moveToFirst()) {
            do {
                val messageBody: String = cursor.getString(cursor.getColumnIndexOrThrow(Telephony.Sms.BODY))
                val messageAddress: String = cursor.getString(cursor.getColumnIndexOrThrow(Telephony.Sms.ADDRESS))
                val messageDate: String = cursor.getString(cursor.getColumnIndexOrThrow(Telephony.Sms.DATE))
                val msgDate = getDateFromTimestamp(messageDate)
                if (msgDate == day) {
                    smsList.add(Sms().apply {
                        this.messageBody = messageBody
                        this.messageAddress = messageAddress
                        this.messageDate = messageDate
                    })
                    stop = true
                } else {

                    if (messageDate.toLong() < dateTime.toLong()) {
                        stop = true
                    }

                    if (stop) {
                        break
                    }
                }


            } while (cursor.moveToNext())

            cursor.close()
        }

        val gson = Gson()

        promise.resolve(gson.toJson(smsList))
    }




    override fun getName(): String {
        return "Utils"
    }
}


class Sms {
    var messageBody: String = ""
    var messageAddress: String = ""
    var messageDate: String = ""
}