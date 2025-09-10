import Link from "next/link"

export default function AboutPage() {
  return (
    <div className='overlay'>
        <div className='playboard'>
            <h1>Contact</h1>
            <p className='display-text-small'>
                Have questions, feedback, or just want to say hi? 
                Feel free to reach out!
            </p>

            <p className='display-text-small'>
                You can email us directly at:{" "}
          <a href="mailto:hello@example.com" className="display-text-blue">
            waltzfourd@gmail.com
            </a>
            </p>

            <footer className='footer'>
          <Link href='/'>Home Page</Link>
        </footer>
        </div>
    
    </div>
  );
}