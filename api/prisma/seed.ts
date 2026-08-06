import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import fs from 'node:fs/promises'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!
})

const prisma = new PrismaClient({
  adapter
})

async function main () {
  // Read the JSON file
  const file = await fs.readFile('./prisma/wordles.json', 'utf8')

  // Convert JSON into a string array
  const words: string[] = JSON.parse(file)

  // Insert every word into the database
  await prisma.word.createMany({
    data: words.map(word => ({
      value: word.toLowerCase()
    })),
    skipDuplicates: true
  })

  console.log(`Successfully inserted ${words.length} words.`)
}

main()
  .catch(error => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
