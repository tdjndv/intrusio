import Link from "next/link"

export default function AboutPage() {
  return (
    <div className='overlay'>
        <div className='playboard'>
            <h1>About</h1>
            <p className='display-text-small'>
                This flashcard game isn’t just for fun—it’s backed by a serious
            database! Each of the 6 supported languages comes with
          20,000+ carefully selected words, so you’ll never run
          out of practice material. Whether you’re brushing up on basics or
          diving into advanced vocab, there’s always another synonym waiting
          for you.
            </p>

        <footer className='footer'>
          <Link href='/'>Home Page</Link>
        </footer>

        </div>
    
    </div>
  );
}