-- CreateTable
CREATE TABLE "WhyUsPic" (
    "id" TEXT NOT NULL,
    "image" JSONB NOT NULL DEFAULT '[]',
    "tag" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhyUsPic_pkey" PRIMARY KEY ("id")
);
