package com.naptlt

import android.app.Notification
import android.content.Context
import android.service.notification.StatusBarNotification
import android.text.TextUtils
import android.util.Log

class RNNotification(context: Context, sbn: StatusBarNotification) {
    private val tag = "RNNotificationListener"

    private var app: String? = null
    var title: String? = null
    private var titleBig: String? = null
    var text: String? = null
    private var subText: String? = null
    private var summaryText: String? = null
    private var bigText: String? = null
    private var groupedMessages: ArrayList<RNGroupedNotification>? = null
    private var extraInfoText: String? = null
    private var time: String? = null
    private var appName: String? = null

    init {
        val notification: Notification? = sbn.notification

        if (notification?.extras != null) {
            val packageName: String = sbn.packageName

            val applicationInfo = context.packageManager.getApplicationInfo(packageName, 0)

            this.appName = context.packageManager.getApplicationLabel(applicationInfo).toString()
            this.time = sbn.postTime.toString()
            this.app = if (TextUtils.isEmpty(packageName)) "Unknown App" else packageName
            this.title = getPropertySafely(notification, Notification.EXTRA_TITLE)
            this.titleBig = getPropertySafely(notification, Notification.EXTRA_TITLE_BIG)
            this.text = getPropertySafely(notification, Notification.EXTRA_TEXT)
            this.subText = getPropertySafely(notification, Notification.EXTRA_SUB_TEXT)
            this.summaryText = getPropertySafely(notification, Notification.EXTRA_SUMMARY_TEXT)
            this.bigText = getPropertySafely(notification, Notification.EXTRA_BIG_TEXT)
            this.extraInfoText = getPropertySafely(notification, Notification.EXTRA_INFO_TEXT)
            this.groupedMessages = getGroupedNotifications(notification)
        } else {
            Log.d(tag, "The notification received has no data")
        }
    }

    private fun getPropertySafely(notification: Notification, key: String): String? {
        return if (notification.extras.containsKey(key)) {
            notification.extras.getString(key)
        } else {
            null
        }
    }
    private fun getGroupedNotifications(notification: Notification): ArrayList<RNGroupedNotification>? {
        val result = ArrayList<RNGroupedNotification>()

        try {
            val lines = notification.extras.getCharSequenceArray(Notification.EXTRA_TEXT_LINES)

            if (!lines.isNullOrEmpty()) {
                for (line in lines) {
                    if (!line.isNullOrEmpty()) {
                        val groupedNotification = RNGroupedNotification(this, line)
                        result.add(groupedNotification)
                    }
                }
            }

            return result
        } catch (e: Exception) {
            e.message?.let { Log.d(tag, it) }
            return result
        }

    }
}