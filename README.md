# surfe-vue

Frontend challenge for Surfe.

### Running the project
1. `cd` into `surfe-vue`
2. Install dependencies with `npm i`
3. Run it with `npm run dev`

### Build it

```sh
npm run build
```

### Run Unit Tests

```sh
npm run test:unit
```

### Lint

```sh
npm run lint
```

## UI/UX Implementation Details

1. The UI follows a mobile-first approach, reflected by how the breakpoint mixins are applied;
2. CSS class naming follows BEMIT convention;
3. CSS attributes are ordered alphabetically;
4. We make use of SCSS preprocessor mainly for Mixins and Nesting; Native CSS custom properties are prefered over SCSS variables;

## Session Loading Lifecycle

The app will try to load Notes from an existing localstate value. If none exists, one is created and later used.

### Flow
```mermaid
flowchart TB
    START((Load App))
    GET_NOTES(Get Notes from Server)
    KEEP_SESSION(Store to Vuex Store)
    GENERATE(Generate New Session)
    TO_STATE(Store to browser localstate)
    TO_STORE(Store to Vuex Store)
    END((Finished\nLoading))

    START --> CHECK_STATE{Has Session in\n localstate?}
    CHECK_STATE -- YES --> KEEP_SESSION --> GET_NOTES
    CHECK_STATE -- NO --> GENERATE
    GENERATE --> TO_STATE
    TO_STATE --> TO_STORE
    GET_NOTES --> TO_STORE
    TO_STORE --> END
```
