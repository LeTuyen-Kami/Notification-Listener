package com.naptlt

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class RNNotificationListenerHeadlessTask: HeadlessJsTaskService(){
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        if (intent != null) {
            return intent.extras?.let {
                HeadlessJsTaskConfig(
                    "RNNotificationListenerHeadlessTask",
                    Arguments.fromBundle(it),
                    15000,
                    true
                )
            }
        }
        return null
    }
}