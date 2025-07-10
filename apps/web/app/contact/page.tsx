import Contact from '@repo/ui/contact'

// Force dynamic rendering to prevent build timeouts
export const dynamic = 'force-dynamic'

export default function ContactUs() {
  return <Contact />
}