import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to the intake form page (adjust the path if needed)
    router.push('/form');  // If your intake form page is under pages/form.js
  }, []);

  return (
    <div>
      <p>Redirecting to the Leadership Evolution Project Intake Form...</p>
    </div>
  );
}