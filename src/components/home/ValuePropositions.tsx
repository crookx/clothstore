'use client';

import { Truck, RefreshCcw, Shield, HeadphonesIcon } from 'lucide-react';

export default function ValuePropositions() {
  return (
    <section className="py-8 bg-muted/30 rounded-lg mb-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4">
            <Truck className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">On orders over KES 5000</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <RefreshCcw className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Easy Returns</h3>
              <p className="text-sm text-muted-foreground">14-day return policy</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">100% authentic products</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4">
            <HeadphonesIcon className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-semibold">Expert Support</h3>
              <p className="text-sm text-muted-foreground">24/7 customer service</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}