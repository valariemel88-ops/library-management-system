
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create four book genres
  const genreData = [
    { name: 'Fiction', description: 'Imaginary stories and novels' },
    { name: 'Science', description: 'Scientific knowledge and discoveries' },
    { name: 'Technology', description: 'Computing and technological innovation' },
    { name: 'History', description: 'Historical events and biographies' },
  ];

  const genres = await Promise.all(
    genreData.map((genre) =>
      prisma.genre.upsert({
        where: { name: genre.name },
        update: { description: genre.description },
        create: genre,
      }),
    ),
  );

  const genreIds = Object.fromEntries(
    genres.map((genre) => [genre.name, genre.id]),
  );

  // Create fifteen books across the four genres
  const books = [
    { title: 'Things Fall Apart', author: 'Chinua Achebe', isbn: '9780385474542', publishedYear: 1958, genre: 'Fiction' },
    { title: 'The River Between', author: 'Ngugi wa Thiong’o', isbn: '9780143106692', publishedYear: 1965, genre: 'Fiction' },
    { title: 'Purple Hibiscus', author: 'Chimamanda Ngozi Adichie', isbn: '9781616202415', publishedYear: 2003, genre: 'Fiction' },
    { title: 'The Alchemist', author: 'Paulo Coelho', isbn: '9780061122415', publishedYear: 1988, genre: 'Fiction' },

    { title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '9780553380163', publishedYear: 1988, genre: 'Science' },
    { title: 'The Selfish Gene', author: 'Richard Dawkins', isbn: '9780198788607', publishedYear: 1976, genre: 'Science' },
    { title: 'Cosmos', author: 'Carl Sagan', isbn: '9780345539434', publishedYear: 1980, genre: 'Science' },
    { title: 'Silent Spring', author: 'Rachel Carson', isbn: '9780618249060', publishedYear: 1962, genre: 'Science' },

    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '9780132350884', publishedYear: 2008, genre: 'Technology' },
    { title: 'The Pragmatic Programmer', author: 'David Thomas', isbn: '9780135957059', publishedYear: 2019, genre: 'Technology' },
    { title: 'Code', author: 'Charles Petzold', isbn: '9780735611313', publishedYear: 1999, genre: 'Technology' },
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '9780262046305', publishedYear: 2022, genre: 'Technology' },

    { title: 'The Wretched of the Earth', author: 'Frantz Fanon', isbn: '9780802141323', publishedYear: 1961, genre: 'History' },
    { title: 'Long Walk to Freedom', author: 'Nelson Mandela', isbn: '9780316548182', publishedYear: 1994, genre: 'History' },
    { title: 'The History of the Ancient World', author: 'Susan Wise Bauer', isbn: '9780393059748', publishedYear: 2007, genre: 'History' },
  ];

  for (const book of books) {
    const { genre, ...bookData } = book;

    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {
        ...bookData,
        genreId: genreIds[genre],
      },
      create: {
        ...bookData,
        genreId: genreIds[genre],
      },
    });
  }

  console.log('Database seeded successfully!');
  console.log(`Genres created: ${genres.length}`);
  console.log(`Books added: ${books.length}`);
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });