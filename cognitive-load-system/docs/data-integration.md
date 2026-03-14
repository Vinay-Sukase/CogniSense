# Reference Data Integration

## Overview

The project now supports importing external benchmark datasets into MongoDB and exporting a normalized reference training dataset for the ML microservice.

## Imported Sources

### 1. Simple reaction times

- Default path:
  - `D:\.GECA SEM 2\MINI Project\datasets\simple-reaction-times-VBRHDT-data-2024_06_16.csv`
- Use:
  - Participant-level aggregation for `reaction_time_mean` and `reaction_time_variance`

### 2. Digital behavior

- Default path:
  - `D:\.GECA SEM 1\Cognitive-Self-Analysis\data\raw\digital_behavior.csv`
- Use:
  - Maps screen-time, focus, anxiety, and wellbeing fields into questionnaire-like workload proxies

### 3. Mental health tech survey

- Default path:
  - `D:\.GECA SEM 1\Cognitive-Self-Analysis\data\raw\mental_health_tech.csv`
- Use:
  - Maps work interference, treatment, family history, and related fields into indirect workload proxies

### 4. EEG arithmetic and Stroop raw files

- Default paths:
  - `D:\.GECA SEM 2\MINI Project\datasets\Cognitive Load Assessment Through EEG A Dataset from Arithmetic and Stroop Tasks\raw_data\raw_data\Arithmetic_Data`
  - `D:\.GECA SEM 2\MINI Project\datasets\Cognitive Load Assessment Through EEG A Dataset from Arithmetic and Stroop Tasks\raw_data\raw_data\Stroop_Data`
- Use:
  - Summarizes raw signal amplitudes into benchmark interference-style indicators

### 5. Figshare DOI source

- DOI:
  - [10.6084/m9.figshare.28184417](https://doi.org/10.6084/m9.figshare.28184417)
- Use:
  - Optional local directory import if you download the related CSV exports and set `FIGSHARE_ATTENTION_WORKLOAD_DIR`

## Database Collection

Imported records are stored in the `BenchmarkRecord` collection via:

- [BenchmarkRecord.js](/C:/Users/Zeb/OneDrive/Documents/New%20project/cognitive-load-system/backend/models/BenchmarkRecord.js)

Each record contains:

- `source`
- `source_record_id`
- `target_label`
- `cognitive_load_score`
- `feature_vector`
- `label_method`
- `provenance`

## Import Command

From the repository root:

```powershell
cd "C:\Users\Zeb\OneDrive\Documents\New project\cognitive-load-system\database"
node importReferenceData.js
```

This will:

1. Import normalized benchmark records into MongoDB
2. Export a training CSV to:
   - `database/exports/reference-benchmark-data.csv`
3. Export labeled training datasets to:
   - `database/exports/labeled-training-datasets/reaction-time-training.csv`
   - `database/exports/labeled-training-datasets/working-memory-training.csv`
   - `database/exports/labeled-training-datasets/memory-recall-training.csv`
   - `database/exports/labeled-training-datasets/reading-training.csv`
   - `database/exports/labeled-training-datasets/stroop-training.csv`
   - `database/exports/labeled-training-datasets/questionnaire-training.csv`
   - `database/exports/labeled-training-datasets/combined-model-training.csv`
4. Generate a manifest file:
   - `database/exports/labeled-training-datasets/dataset-manifest.json`

## Dataset labeling

Each exported training dataset is explicitly labeled by the test or module it should be used for:

- `reaction_time`
- `working_memory`
- `memory_recall`
- `reading`
- `stroop`
- `questionnaire`
- `combined_model`

The combined export also includes a `train_target_tests` field so you can see which test families each normalized benchmark row contributes to.

## Train the ML model from imported reference data

Start the ML service, then call:

```http
POST /train/reference
```

Optional body:

```json
{
  "dataset_path": "C:/path/to/reference-benchmark-data.csv"
}
```

## Benchmark-aware suggestions

The backend now compares a live user session against benchmark averages and includes those comparisons in the session object. Suggestions use:

- test metrics
- questionnaire signals
- ML prediction
- benchmark comparison against imported reference data

## Important limitation

Some external datasets do not match the app’s feature schema exactly. Where no direct field exists, the import script uses transparent heuristic mappings. These heuristics are useful for reference benchmarking and broader model training, but they should not be treated as clinically validated conversions.
