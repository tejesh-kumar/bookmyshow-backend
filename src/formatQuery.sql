-- WITH
--   languageData AS (
--     SELECT
--       movieId,
--       JSON_ARRAYAGG (name) AS languages
--     FROM
--       movieLanguages ml
--       JOIN languages l ON ml.laguageId = l.id
--     GROUP BY
--       movieId
--   ),
--   genreData AS (
--     SELECT
--       movieId,
--       JSON_ARRAYAGG (name) AS genres
--     FROM
--       movieGenres mg
--       JOIN genres g ON mg.genreId = g.id
--     GROUP BY
--       movieId
--   )
-- SELECT
--   m.*,
--   ml.languages,
--   mg.genres
-- FROM
--   movies m
--   LEFT JOIN laguageData ON m.id = languageData.movieId
--   LEFT JOIN genreData ON m.id = genreData.movieId
-- WITH
--   languageData AS (
--     SELECT
--       movieId,
--       JSON_ARRAYAGG(name) AS languages
--     FROM
--       movieLanguages ml
--       JOIN languages l ON ml.languageId = l.id
--     WHERE
--       l.name IN (${languageFilter?.placeholders})
--     GROUP BY
--       movieId
--   ),
--   genreData AS (
--     SELECT
--       movieId,
--       JSON_ARRAYAGG(name) AS genres
--     FROM
--       movieGenres mg
--       JOIN genres g ON mg.genreId = g.id
--     WHERE
--       g.name IN (${genreFilter?.placeholders})
--     GROUP BY
--       movieId
--   )
-- SELECT
--   m.*,
--   languageData.languages,
--   genreData.genres
-- FROM
--   movies m
--   JOIN languageData ON m.id = languageData.movieId
--   JOIN genreData ON m.id = genreData.movieId 
--   ${isCursorClauseRequired && cursorClauseString}
--   ${limit && limitString}

SELECT
  movieId,
  JSON_ARRAYAGG (name) AS languages
FROM
  movieLanguages ml
  JOIN languages l ON ml.languageId = l.id EXISTS (
    SELECT
      1
    from
      movieLanguages
    WHERE
      l.name = ${languageFilter?.placeholders}
  )
GROUP BY
  movieId;
