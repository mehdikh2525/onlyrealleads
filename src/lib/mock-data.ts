import { faker } from '@faker-js/faker'

export interface MockLead {
  id: string
  email: string
  phone?: string
  company: string
  source: string
  status: 'passed' | 'blocked' | 'review'
  reason?: string
  score: number
  location: string
  created_at: string
  form_name: string
}

const sources = ['Google Ads', 'Facebook', 'Website Form', 'LinkedIn', 'Organic Search']
const statuses = ['passed', 'blocked', 'review'] as const
const reasons = [
  'Temporary email',
  'Invalid phone', 
  'Suspicious location',
  'Spam keywords',
  'New domain',
  'Fast submission',
  'Honeypot filled',
  'Bot behavior'
]

export function generateMockLeads(count: number = 50): MockLead[] {
  return Array.from({ length: count }, () => {
    const status = faker.helpers.arrayElement(statuses)
    const score = status === 'passed' ? faker.number.int({ min: 70, max: 95 }) :
                  status === 'blocked' ? faker.number.int({ min: 5, max: 25 }) :
                  faker.number.int({ min: 40, max: 70 })
    
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      phone: faker.helpers.maybe(() => faker.phone.number(), { probability: 0.8 }),
      company: faker.company.name(),
      source: faker.helpers.arrayElement(sources),
      status,
      reason: status !== 'passed' ? faker.helpers.arrayElement(reasons) : undefined,
      score,
      location: `${faker.location.city()}, ${faker.location.state({ abbreviated: true })}`,
      created_at: faker.date.recent({ days: 7 }).toISOString(),
      form_name: `${faker.helpers.arrayElement(['Contact', 'Quote', 'Demo', 'Newsletter'])} Form`
    }
  })
}

export const mockLeads = generateMockLeads() 