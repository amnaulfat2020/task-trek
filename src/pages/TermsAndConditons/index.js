import React from 'react'
import termStyle from './termsAndC.module.css'
const TermAndCondition = () => {
  return (

    <div className={termStyle.mainDiv}>
        <h1 className={termStyle.HeaderCls}>Terms and Condition</h1>
        <h3 className={termStyle.HeaderCls2}>Using TaskTrek's Project Management Dashboard, you agree to the following terms and conditions</h3>
      <ul>
        <li>You are responsible for your actions and the content you create or share on the Dashboard</li>
        <li>Keep your login details secure. Don't share them with others. We are not responsible for unauthorized account access</li>
        <li>Your data and content are yours or belong to their respective owners</li>
        <li>We collect and use your data as outlined in our Privacy Policy</li>
        <li>We'll do our best to keep the Dashboard running smoothly, but we can't guarantee it will be available at all times</li>
        <li>We can suspend or terminate your access if you violate these terms</li>
        <li>The Dashboard and its features are our property; you can't copy or reverse engineer them without permission</li>
        <li>We're not responsible for third-party links or content on the Dashboard</li>
        <li>We can't guarantee the Dashboard's accuracy or suitability for your needs</li>
        <li>We're not liable for any damages from using the Dashboard</li>
        <li>We can change these terms, so check them regularly. Your continued use means you accept the changes</li>
      </ul>
    </div>
  )
}

export default TermAndCondition
