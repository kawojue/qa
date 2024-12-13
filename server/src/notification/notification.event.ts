export class CreateEmailNotificationEvent {
  emails: string | string[];
  subject: string;
  from?: string;
  template: string;
  data?: Record<string, any>;
  dynamic?: boolean;

  constructor({
    emails,
    subject,
    template,
    data,
    dynamic,
    from,
  }: {
    emails: string | string[];
    subject: string;
    template: string;
    data?: Record<string, any>;
    dynamic?: boolean;
    from?: string;
  }) {
    this.emails = Array.isArray(emails)
      ? emails.filter(Boolean).map((e) => e.toLowerCase())
      : emails.toLowerCase();
    this.template = template;
    this.subject = subject;
    this.data = data || null;
    this.dynamic = dynamic;
    this.from = from || 'QA';
  }
}
