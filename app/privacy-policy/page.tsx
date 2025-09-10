import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="overlay">
      <div className="playboard">
        <h1>Privacy Policy</h1>

        <p className="display-text-extra-small">
          This flashcard game is currently free to use. We do not collect personal
          information such as your name, address, or phone number.
        </p>

        <p className="display-text-extra-small">
          We may collect basic, non-personal data (such as device type, browser,
          and usage patterns) to improve the Service. In the future, we may display
          ads, in which case advertising partners may use cookies or similar
          technologies. If so, those ads will follow their own privacy practices.
        </p>

        <p className="display-text-extra-small">
          We do not knowingly collect data from children under 13. If you believe
          we have accidentally done so, please contact us.
        </p>

        <p className="display-text-extra-small">
          Questions? Contact us at{" "}
          <a href="mailto:hello@example.com" className="display-text-blue">
            waltzfourd@gmail.com
          </a>.
        </p>

        <p className="display-text-small">Effective Date: September 2025</p>
        <footer className='footer'>
          <Link href='/'>Home Page</Link>
        </footer>
      </div>
    </div>
  );
}