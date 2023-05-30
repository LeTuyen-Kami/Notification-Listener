package com.naptlt

class RNGroupedNotification(mainNotification: RNNotification, message: CharSequence) {
    private var title: String = ""
    private var text: String = ""

    init {
        val formattedMessage: String = message.toString().trim()

        title = if (!mainNotification.title.isNullOrEmpty()) mainNotification.title!! else ""
        text = if (!mainNotification.text.isNullOrEmpty()) mainNotification.text!! else ""

        val endIndex: Int = formattedMessage.indexOf(":")

        if (endIndex != -1) {
            title = formattedMessage.substring(0, endIndex).trim()
            text = formattedMessage.substring(endIndex + 1).trim()
        } else {
            text = formattedMessage
        }
    }
}
