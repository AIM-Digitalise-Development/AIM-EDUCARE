import * as z from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional().or(z.literal('')),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string().min(8, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export const profileSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional().or(z.literal('')),
    password: z.string().optional().or(z.literal('')),
    password_confirmation: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password.length >= 8 && data.password === data.password_confirmation;
      }
      return true;
    },
    {
      message: 'Password must be at least 8 characters and match confirmation',
      path: ['password_confirmation'],
    }
  );

export const examCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  slug: z.string().optional().or(z.literal('')),
  sort_order: z.coerce.number().optional().default(0),
  is_active: z.boolean().default(true),
});

export const examSchema = z.object({
  exam_category_id: z.coerce.number().min(1, 'Category is required'),
  name: z.string().min(1, 'Exam name is required'),
  slug: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  logo_url: z.string().optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

export const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  slug: z.string().optional().or(z.literal('')),
  sort_order: z.coerce.number().optional().default(0),
});

export const topicSchema = z.object({
  name: z.string().min(1, 'Topic name is required'),
  slug: z.string().optional().or(z.literal('')),
});

export const planSchema = z.object({
  exam_id: z.coerce.number().min(1, 'Exam is required'),
  name: z.string().min(1, 'Plan name is required'),
  type: z.enum(['single', 'combo5', 'combo10', 'custom']),
  price: z.coerce.number().min(0, 'Price must be 0 or more'),
  mock_count: z.coerce.number().min(1, 'Must include at least 1 mock'),
  validity_days: z.coerce.number().min(1, 'Validity must be at least 1 day'),
  is_active: z.boolean().default(true),
});

export const testSchema = z.object({
  exam_id: z.coerce.number().min(1, 'Exam is required'),
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['full_mock', 'sectional', 'pyq', 'live', 'topic']),
  total_duration_sec: z.coerce.number().min(60, 'Duration must be at least 1 minute (60s)'),
  total_marks: z.coerce.number().optional(),
  default_marks: z.coerce.number().min(0).default(1),
  default_negative: z.coerce.number().default(0.25),
  shuffle_questions: z.boolean().default(false),
  shuffle_options: z.boolean().default(false),
  negative_marking_enabled: z.boolean().default(true),
  sections_enabled: z.boolean().default(false),
  result_visibility: z.enum(['marks_only', 'full', 'hidden']).default('full'),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});