package com.naptlt
import android.content.ComponentName
import android.content.Intent
import android.provider.Contacts
import android.util.Log
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class RNNotificationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "RNNotification"
    }

    @ReactMethod
    fun requestNotificationPermission() {
        Intent("android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS").also {
            it.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            reactApplicationContext.startActivity(it)
        }
    }

    @ReactMethod
    fun getNotificationPermission(promise: Promise) {
        //android.settings.ACTION_NOTIFICATION_LISTENER_SETTINGS
        val packageNames = NotificationManagerCompat.getEnabledListenerPackages(reactApplicationContext)
        val isPermissionGranted = packageNames.contains(reactApplicationContext.packageName)
        promise.resolve(isPermissionGranted)
    }

}


