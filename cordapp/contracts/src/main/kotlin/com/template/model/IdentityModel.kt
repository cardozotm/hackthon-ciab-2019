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
    val personalDataAuth: Boolean,
    val contactDataAuth: Boolean,
    val financialDataAuth: Boolean,
    val personalData: String,
    val contactData: String,
    val financialData: String
)
