-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('INSTITUTE', 'COMMERCIAL', 'FACILITY_EXPRESSION', 'INDUSTRIAL', 'OTHER');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('PLANNING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "f_name" TEXT NOT NULL,
    "m_name" TEXT NOT NULL,
    "l_name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" "ProjectType" NOT NULL,
    "technologyused" TEXT NOT NULL,
    "status" "ProjectStatus" NOT NULL,
    "images" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfoliowork" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "file" JSONB NOT NULL DEFAULT '[]',
    "status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "portfoliowork_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobrole" (
    "id" UUID NOT NULL,
    "Role" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "qualification" TEXT NOT NULL,
    "jd" JSONB NOT NULL DEFAULT '[]',
    "status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "jobrole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Applications" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "resume" JSONB NOT NULL DEFAULT '[]',
    "jbroleId" UUID NOT NULL,

    CONSTRAINT "Applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "project_title_key" ON "project"("title");

-- CreateIndex
CREATE UNIQUE INDEX "portfoliowork_title_key" ON "portfoliowork"("title");

-- AddForeignKey
ALTER TABLE "Applications" ADD CONSTRAINT "Applications_jbroleId_fkey" FOREIGN KEY ("jbroleId") REFERENCES "jobrole"("id") ON DELETE CASCADE ON UPDATE CASCADE;
