-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'COACH', 'RECORDS', 'CAPTAIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "Bowstyle" AS ENUM ('BAREBOW', 'RECURVE', 'COMPOUND', 'LONGBOW');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('OPEN', 'FEMALE', 'NOT_SET');

-- CreateEnum
CREATE TYPE "AgeCategories" AS ENUM ('UNDER_12', 'UNDER_14', 'UNDER_15', 'UNDER_16', 'UNDER_18', 'UNDER_21', 'SENIOR', 'OVER_FIFTY');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('PARENT', 'GRANDPARENT', 'GUARDIAN', 'SPOUSE', 'SIBLING', 'FRIEND', 'OTHER');

-- CreateEnum
CREATE TYPE "Venue" AS ENUM ('INDOOR', 'OUTDOOR');

-- CreateEnum
CREATE TYPE "IndoorClassification" AS ENUM ('IA3', 'IA2', 'IA1', 'IB3', 'IB2', 'IB1', 'IMB', 'IGMB', 'UNCLASSIFIED');

-- CreateEnum
CREATE TYPE "OutdoorClassification" AS ENUM ('A3', 'A2', 'A1', 'B3', 'B2', 'B1', 'MB', 'GMB', 'EMB', 'UNCLASSIFIED');

-- CreateEnum
CREATE TYPE "CompetitionStatus" AS ENUM ('PRACTICE', 'CLUB_EVENT', 'OPEN_COMPETITION', 'RECORD_STATUS_COMPETITION');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "membershipNumber" TEXT,
    "defaultBowstyle" "Bowstyle",
    "sex" "Sex",
    "yearOfBirth" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roles" "Role"[],
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invite" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "userId" TEXT,
    "membershipNumber" TEXT,
    "invitedBy" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3),
    "declined_at" TIMESTAMP(3),

    CONSTRAINT "Invite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "emailAddress" TEXT,
    "relationshipToUser" "RelationshipType",
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateShot" TIMESTAMP(3) NOT NULL,
    "roundName" TEXT NOT NULL,
    "venue" "Venue" NOT NULL DEFAULT 'INDOOR',
    "bowstyle" "Bowstyle" NOT NULL,
    "score" INTEGER NOT NULL,
    "xs" INTEGER,
    "tens" INTEGER,
    "nines" INTEGER,
    "hits" INTEGER,
    "sex" "Sex" NOT NULL DEFAULT 'OPEN',
    "ageCategory" "AgeCategories" NOT NULL DEFAULT 'SENIOR',
    "notes" TEXT,
    "journal" TEXT,
    "roundIndoorClassification" "IndoorClassification",
    "roundOutdoorClassification" "OutdoorClassification",
    "roundHandicap" INTEGER,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processed_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scoresheet" (
    "id" TEXT NOT NULL,
    "scoreId" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,

    CONSTRAINT "Scoresheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordsSummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "indoorClassification" "IndoorClassification" NOT NULL DEFAULT 'UNCLASSIFIED',
    "indoorClassificationBadgeGiven" "IndoorClassification",
    "indoorHandicap" INTEGER,
    "outdoorClassification" "OutdoorClassification" NOT NULL DEFAULT 'UNCLASSIFIED',
    "outdoorClassificationBadgeGiven" "OutdoorClassification",
    "outdoorHandicap" INTEGER,
    "notes" TEXT,

    CONSTRAINT "RecordsSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_membershipNumber_key" ON "User"("membershipNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Club_name_key" ON "Club"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Scoresheet_scoreId_key" ON "Scoresheet"("scoreId");

-- CreateIndex
CREATE UNIQUE INDEX "RecordsSummary_userId_key" ON "RecordsSummary"("userId");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invite" ADD CONSTRAINT "Invite_invitedBy_fkey" FOREIGN KEY ("invitedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scoresheet" ADD CONSTRAINT "Scoresheet_scoreId_fkey" FOREIGN KEY ("scoreId") REFERENCES "Score"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scoresheet" ADD CONSTRAINT "Scoresheet_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecordsSummary" ADD CONSTRAINT "RecordsSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
