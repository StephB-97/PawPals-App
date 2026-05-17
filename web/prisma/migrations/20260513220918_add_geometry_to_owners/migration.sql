-- AlterTable
ALTER TABLE "owners" ADD COLUMN     "location" geometry(Point, 4326);
-- Create spatial index (GiST) for faster proximity queries
CREATE INDEX idx_owners_location_gist ON owners USING GIST (location);

-- Populate geometry from existing lat/lng
UPDATE owners
SET location = ST_SetSRID(ST_Point(longitude, latitude), 4326)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;