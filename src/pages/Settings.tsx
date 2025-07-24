import React from 'react'
import { Settings as SettingsIcon, Phone, Bell, Shield, CreditCard, HelpCircle } from 'lucide-react'

export function Settings() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and messaging preferences</p>
      </div>

      <div className="space-y-8">
        {/* Twilio Configuration */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Phone className="w-5 h-5 text-primary mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Twilio Configuration</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Connect your Twilio account to enable SMS messaging functionality
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account SID
              </label>
              <input
                type="text"
                placeholder="Enter your Twilio Account SID"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auth Token
              </label>
              <input
                type="password"
                placeholder="Enter your Twilio Auth Token"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Your Twilio phone number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Save Twilio Settings
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Bell className="w-5 h-5 text-primary mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Message Delivery Notifications</div>
                <div className="text-sm text-gray-600">Get notified when messages are delivered</div>
              </div>
              <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Reply Notifications</div>
                <div className="text-sm text-gray-600">Get notified when guests reply to messages</div>
              </div>
              <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Scheduled Message Reminders</div>
                <div className="text-sm text-gray-600">Get reminded before scheduled messages are sent</div>
              </div>
              <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
            </label>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <Shield className="w-5 h-5 text-primary mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Two-Factor Authentication</div>
                <div className="text-sm text-gray-600">Add an extra layer of security to your account</div>
              </div>
              <button className="text-primary hover:text-primary/80 font-medium">
                Enable
              </button>
            </label>
            <label className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Data Export</div>
                <div className="text-sm text-gray-600">Download your data and message history</div>
              </div>
              <button className="text-primary hover:text-primary/80 font-medium">
                Export
              </button>
            </label>
          </div>
        </div>

        {/* Billing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <CreditCard className="w-5 h-5 text-primary mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Billing & Usage</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Current Plan</div>
                <div className="text-sm text-gray-600">Pay-as-you-go messaging</div>
              </div>
              <button className="text-primary hover:text-primary/80 font-medium">
                View Usage
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Messages This Month</div>
                <div className="text-sm text-gray-600">247 messages sent</div>
              </div>
              <span className="text-gray-900 font-medium">$12.35</span>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <HelpCircle className="w-5 h-5 text-primary mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Help & Support</h3>
          </div>
          <div className="space-y-3">
            <a href="#" className="block text-primary hover:text-primary/80 font-medium">
              Documentation & Guides
            </a>
            <a href="#" className="block text-primary hover:text-primary/80 font-medium">
              Contact Support
            </a>
            <a href="#" className="block text-primary hover:text-primary/80 font-medium">
              Feature Requests
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}