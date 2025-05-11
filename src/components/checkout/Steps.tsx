'use client';

import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';

const steps = [
  { id: 'shipping', name: 'Shipping', href: '/checkout/shipping' },
  { id: 'payment', name: 'Payment', href: '/checkout/payment' },
  { id: 'review', name: 'Review', href: '/checkout/review' },
];

export function Steps() {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex(step => step.href === pathname);

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li
            key={step.name}
            className={`relative ${
              index !== steps.length - 1 ? 'flex-1' : ''
            }`}
          >
            {index < currentStepIndex ? (
              <div className="group">
                <span className="flex items-center">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <Check className="h-5 w-5 text-white" />
                  </span>
                  <span className="ml-4 text-sm font-medium">{step.name}</span>
                </span>
              </div>
            ) : index === currentStepIndex ? (
              <div className="flex items-center" aria-current="step">
                <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                </span>
                <span className="ml-4 text-sm font-medium">{step.name}</span>
              </div>
            ) : (
              <div className="group">
                <span className="flex items-center">
                  <span className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-500">
                    {step.name}
                  </span>
                </span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}