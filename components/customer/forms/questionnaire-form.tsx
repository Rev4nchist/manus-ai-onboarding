'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form schemas
const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  employees: z.coerce.number().min(1, "Number of employees required"),
  yearFounded: z.coerce.number().min(1900, "Year must be valid").max(new Date().getFullYear(), "Year cannot be in the future"),
});

const contactSchema = z.object({
  contactName: z.string().min(1, "Contact name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Valid phone number required"),
  contactPosition: z.string().min(1, "Position is required"),
});

const requirementsSchema = z.object({
  requirements: z.string().min(10, "Please provide more details about your requirements"),
  expectedGoLiveDate: z.string().min(1, "Expected go-live date is required"),
  additionalNotes: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof companySchema>;
type ContactFormValues = z.infer<typeof contactSchema>;
type RequirementsFormValues = z.infer<typeof requirementsSchema>;
type FormData = CompanyFormValues & ContactFormValues & RequirementsFormValues;

export function QuestionnaireForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  
  // Form methods for each step
  const companyForm = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: formData,
  });
  
  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: formData,
  });
  
  const requirementsForm = useForm<RequirementsFormValues>({
    resolver: zodResolver(requirementsSchema),
    defaultValues: formData,
  });
  
  // Handle step navigation
  const nextStep = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  // Submit complete form
  const submitForm = async (data: Partial<FormData>) => {
    const completeData = { ...formData, ...data };
    // Save to Firestore logic would go here
    console.log("Form submitted:", completeData);
    
    // Show success message
    alert("Form submitted successfully!");
    
    // Reset form and go back to step 1
    setFormData({});
    setStep(1);
  };
  
  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="w-full flex items-center">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div className={`
                flex items-center justify-center rounded-full w-10 h-10 text-sm font-medium
                ${step >= stepNumber 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-200 text-gray-600"}
              `}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`
                  h-1 flex-1
                  ${step > stepNumber ? "bg-blue-600" : "bg-gray-200"}
                `} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Step content */}
      <div className="bg-white rounded-lg border p-6">
        {step === 1 && (
          <form onSubmit={companyForm.handleSubmit(nextStep)} className="space-y-4">
            <h2 className="text-xl font-semibold">Company Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium mb-1">
                  Company Name
                </label>
                <input 
                  id="companyName" 
                  className="w-full px-3 py-2 border rounded-md"
                  {...companyForm.register('companyName')} 
                />
                {companyForm.formState.errors.companyName && (
                  <p className="text-sm text-red-600 mt-1">
                    {companyForm.formState.errors.companyName.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium mb-1">
                  Industry
                </label>
                <select 
                  id="industry" 
                  className="w-full px-3 py-2 border rounded-md"
                  {...companyForm.register('industry')}
                >
                  <option value="">Select an industry</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Retail">Retail</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
                {companyForm.formState.errors.industry && (
                  <p className="text-sm text-red-600 mt-1">
                    {companyForm.formState.errors.industry.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="employees" className="block text-sm font-medium mb-1">
                  Number of Employees
                </label>
                <input 
                  id="employees" 
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  {...companyForm.register('employees')} 
                />
                {companyForm.formState.errors.employees && (
                  <p className="text-sm text-red-600 mt-1">
                    {companyForm.formState.errors.employees.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="yearFounded" className="block text-sm font-medium mb-1">
                  Year Founded
                </label>
                <input 
                  id="yearFounded" 
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  {...companyForm.register('yearFounded')} 
                />
                {companyForm.formState.errors.yearFounded && (
                  <p className="text-sm text-red-600 mt-1">
                    {companyForm.formState.errors.yearFounded.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            </div>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={contactForm.handleSubmit(nextStep)} className="space-y-4">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium mb-1">
                  Contact Name
                </label>
                <input 
                  id="contactName" 
                  className="w-full px-3 py-2 border rounded-md"
                  {...contactForm.register('contactName')} 
                />
                {contactForm.formState.errors.contactName && (
                  <p className="text-sm text-red-600 mt-1">
                    {contactForm.formState.errors.contactName.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input 
                  id="contactEmail" 
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                  {...contactForm.register('contactEmail')} 
                />
                {contactForm.formState.errors.contactEmail && (
                  <p className="text-sm text-red-600 mt-1">
                    {contactForm.formState.errors.contactEmail.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input 
                  id="contactPhone" 
                  className="w-full px-3 py-2 border rounded-md"
                  {...contactForm.register('contactPhone')} 
                />
                {contactForm.formState.errors.contactPhone && (
                  <p className="text-sm text-red-600 mt-1">
                    {contactForm.formState.errors.contactPhone.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="contactPosition" className="block text-sm font-medium mb-1">
                  Position
                </label>
                <input 
                  id="contactPosition" 
                  className="w-full px-3 py-2 border rounded-md"
                  {...contactForm.register('contactPosition')} 
                />
                {contactForm.formState.errors.contactPosition && (
                  <p className="text-sm text-red-600 mt-1">
                    {contactForm.formState.errors.contactPosition.message}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                type="button" 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={prevStep}
              >
                Previous
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Next
              </button>
            </div>
          </form>
        )}
        
        {step === 3 && (
          <form onSubmit={requirementsForm.handleSubmit(submitForm)} className="space-y-4">
            <h2 className="text-xl font-semibold">Project Requirements</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="requirements" className="block text-sm font-medium mb-1">
                  Project Requirements
                </label>
                <textarea 
                  id="requirements" 
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Please describe your project requirements in detail"
                  {...requirementsForm.register('requirements')} 
                />
                {requirementsForm.formState.errors.requirements && (
                  <p className="text-sm text-red-600 mt-1">
                    {requirementsForm.formState.errors.requirements.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="expectedGoLiveDate" className="block text-sm font-medium mb-1">
                  Expected Go-Live Date
                </label>
                <input 
                  id="expectedGoLiveDate" 
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  {...requirementsForm.register('expectedGoLiveDate')} 
                />
                {requirementsForm.formState.errors.expectedGoLiveDate && (
                  <p className="text-sm text-red-600 mt-1">
                    {requirementsForm.formState.errors.expectedGoLiveDate.message}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="additionalNotes" className="block text-sm font-medium mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea 
                  id="additionalNotes" 
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Any additional information you'd like to share"
                  {...requirementsForm.register('additionalNotes')} 
                />
              </div>
            </div>
            
            <div className="flex justify-between">
              <button 
                type="button" 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={prevStep}
              >
                Previous
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
