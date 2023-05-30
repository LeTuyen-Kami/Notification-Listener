package com.naptlt

import android.content.pm.PackageManager

class AppList {



    //fun return list app include packagename and appname
    fun getAppList(packageManager: PackageManager): ArrayList<Map<String, String>> {
        val appList = ArrayList<Map<String, String>>()
        val applications: List<android.content.pm.ApplicationInfo> = if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            packageManager.getInstalledApplications(PackageManager.ApplicationInfoFlags.of(0))
        } else {
            packageManager.getInstalledApplications(PackageManager.GET_META_DATA)
        }

        for (application in applications) {
            if (application.flags and android.content.pm.ApplicationInfo.FLAG_SYSTEM==0) {
                val app = mapOf("packageName" to application.packageName, "appName" to application.loadLabel(packageManager).toString())
                appList.add(app)
            }
        }
        return appList
    }
}