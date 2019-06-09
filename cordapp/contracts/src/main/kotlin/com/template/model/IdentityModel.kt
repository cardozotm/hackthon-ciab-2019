package com.template.model

import net.corda.core.identity.Party
import net.corda.core.serialization.CordaSerializable
import java.time.Instant
import kotlin.reflect.jvm.internal.impl.load.kotlin.JvmType

@CordaSerializable
data class IdentityModel(
    val orgTo : Party,
    val entityName : String,
    val createTime : Instant,
    val uid : String,
    val pubkey : String,
    val personalDataAuth: String,
    val contactDataAuth: String,
    val financialDataAuth: String,
    val personalData: String,
    val contactData: String,
    val financialData: String,
    val message: String,
    val signature: String
)
