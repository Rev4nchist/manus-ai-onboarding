'use client';

import { QuestionnaireForm } from '@/components/customer/forms/questionnaire-form';

export default function FormsPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Onboarding Forms</h1>
        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          1 of 2 forms completed
        </span>
      </div>
      
      <div className="bg-white p-6 rounded-lg border shadow-sm mb-8">
        <h2 className="text-xl font-semibold mb-4">Company Information Form</h2>
        <p className="text-gray-600 mb-4">
          Please complete this form to provide us with essential information about your company.
          This will help us tailor our services to your specific needs and ensure a smooth onboarding process.
        </p>
        <QuestionnaireForm />
      </div>
    </div>
  );
}
