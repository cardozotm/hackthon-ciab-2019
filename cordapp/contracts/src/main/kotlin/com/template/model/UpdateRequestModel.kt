package com.template.model

data class UpdateRequestModel (
        val uid: String,
        val personalData: String,
        val contactData: String,
        val financialData: String,
        val message: String,
        val signature: String
)