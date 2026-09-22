// Shared by the quote form (client) and the /api/enquiry route (server)
// so both sides validate enquiries the same way.

export type Enquiry = {
  name: string;
  phone: string;
  email: string;
  location: string;
  propertyType: string;
  service: string;
  message: string;
};

export type EnquiryErrors = Partial<Record<keyof Enquiry, string>>;

export const enquiryFields: (keyof Enquiry)[] = [
  "name",
  "phone",
  "email",
  "location",
  "propertyType",
  "service",
  "message",
];

// Generous caps so a single request can't send an enormous email.
const maxLengths: Record<keyof Enquiry, number> = {
  name: 100,
  phone: 30,
  email: 200,
  location: 200,
  propertyType: 30,
  service: 100,
  message: 2000,
};

export function validateEnquiry(v: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  if (v.name.trim().length < 2) errors.name = "Please enter your name.";
  if (v.phone.replace(/\D/g, "").length < 10) errors.phone = "Please enter a valid phone number.";
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Please enter a valid email.";
  if (!v.service) errors.service = "Please choose a service.";
  for (const field of enquiryFields) {
    if (v[field].length > maxLengths[field]) errors[field] = "This is too long.";
  }
  return errors;
}

/** Plain-text summary used for the WhatsApp message and the email's text version. */
export function enquiryToText(v: Enquiry): string {
  return [
    "New quote enquiry from the website",
    `Name: ${v.name}`,
    `Phone: ${v.phone}`,
    v.email && `Email: ${v.email}`,
    v.location && `Location: ${v.location}`,
    `Property: ${v.propertyType}`,
    `Service: ${v.service}`,
    v.message && `Details: ${v.message}`,
  ]
    .filter(Boolean)
    .join("\n");
}
