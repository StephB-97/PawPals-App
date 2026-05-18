CREATE INDEX idx_owners_location_gist ON owners USING GIST (location);

UPDATE owners
SET location = ST_SetSRID(ST_Point(longitude, latitude), 4326)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
