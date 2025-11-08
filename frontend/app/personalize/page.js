'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PersonalizeIndex() {
  const router = useRouter();
  useEffect(() => { router.replace('/personalize/step1'); }, [router]);
  return null;
}
