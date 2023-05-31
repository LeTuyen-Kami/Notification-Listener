package com.naptlt

import android.app.Notification
import android.content.Intent
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.facebook.react.HeadlessJsTaskService
import com.google.gson.Gson

class RNNotificationListener: NotificationListenerService() {
    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        val statusBarNotification = sbn?.notification
        if (statusBarNotification?.extras == null) {
            Log.d("RNNotificationListener", "notification or extras is null")
            return
        }
        val context = applicationContext
        val intent = Intent(context, RNNotificationListenerHeadlessTask::class.java)
        val notification = RNNotification(context, sbn)
        val gson = Gson()
        intent.putExtra("notification", gson.toJson(notification))
        HeadlessJsTaskService.acquireWakeLockNow(context)
        context.startService(intent)
    }

    override fun onListenerConnected() {
        super.onListenerConnected()
        val listNotifications = activeNotifications
        Log.d("RNNotificationListener", "onListenerConnected ${listNotifications.size}")
        val listSend = ArrayList<RNNotification>()
        val context = applicationContext
        val intent = Intent(context, RNNotificationListenerHeadlessTask::class.java)
        val gson = Gson()
        for (notification in listNotifications) {
            val statusBarNotification = notification.notification
            if (statusBarNotification?.extras == null) {
                Log.d("RNNotificationListener", "notification or extras is null")
                continue
            }
            val rnNotification = RNNotification(context, notification)
            if (rnNotification.title == null) {
                continue
            }
            listSend.add(rnNotification)
        }
        intent.putExtra("listNotifications", gson.toJson(listSend))
        HeadlessJsTaskService.acquireWakeLockNow(context)
        context.startService(intent)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onDestroy() {
        Log.d("RNNotificationListener", "onDestroy")
        val context = applicationContext
        val intent = Intent(context, RNNotificationListenerHeadlessTask::class.java)
        val gson = Gson()
        intent.putExtra("destroy", gson.toJson("destroy"))
        HeadlessJsTaskService.acquireWakeLockNow(context)
        context.startService(intent)
        super.onDestroy()
    }

}