import emailjs from '@emailjs/browser'

const SERVICE_ID = 'service_qgizw0k'
const TEMPLATE_ID = 'template_gtln8g8'
const PUBLIC_KEY = 'BoU2jd5rBVSTTcLFm'

const sendResolutionEmail = async ({ customerName, customerEmail, ticketTitle, ticketCategory, agentRemarks }) => {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        to_email: customerEmail,
        customer_name: customerName,
        ticket_title: ticketTitle,
        ticket_category: ticketCategory,
        agent_remarks: agentRemarks,
      },
      PUBLIC_KEY
    )
    console.log('Resolution email sent successfully')
    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

export default sendResolutionEmail