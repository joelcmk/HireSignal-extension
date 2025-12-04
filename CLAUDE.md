# Claude Code Instructions for HireSignal Extension

## Project Overview

HireSignal is a Chrome extension that helps track job applications and manage the job search process.

## Key Commands

### Development

- Install dependencies: `npm install`
- Build: `npm run build`
- Build in watch mode: `npm run build -- --watch`

### Testing & Linting

- Run tests: `npm test`
- Fix linting issues: `npm run fix-lint`

## Architecture Notes

<!-- - Extension structure follows Chrome Extension v3 manifest format
- Main entry points are in `src/` directory
- Background service workers handle background tasks
- Content scripts interact with web pages
- Popup UI provides user interface -->

## Key Areas to Understand

<!-- - `manifest.json`: Extension configuration and permissions
- `src/background.ts`: Service worker logic
- `src/content.ts`: Scripts injected into web pages
- `src/popup/`: Extension popup interface -->

<!-- https://www.linkedin.com/jobs/search-results/?currentJobId=4332132272&keywords=trust%20and%20safety&distance=25&geoId=90000064&origin=JOBS_HOME_KEYWORD_HISTORY&trackingId=rMNQRXy9R0QQZ15nIYyFFg%3D%3D&refId=CnB64%2BClnH5MoKvlytxUKw%3D%3D&eBP=NOT_ELIGIBLE_FOR_CHARGING <- Not ad

https://www.linkedin.com/jobs/search-results/?currentJobId=4263757083&keywords=trust%20and%20safety&distance=25&geoId=90000064&origin=JOBS_HOME_KEYWORD_HISTORY&trackingId=RHqBUCIz4Qi8E%2F%2F8H5j83Q%3D%3D&refId=6kuU03G3hCHZEh9mNz2tUA%3D%3D&eBP=CwEAAAGanxcaKvjMQC6DsQHUhZrk5lUrwvsWj-spRSUTf-6kCib_WJp-Wwoos1VbgFGMEFmgZbQO6iXjA_zaMYtxxgWya-dVgZcOiLAqH7sTULEViiYNCAyHQFokW0vFyLKgqvMqjzkckN_Y7dxQc_SnJyFN2g0oKGmBeS_WXE99-idMrGCZnL6d-kjag-rUZY3zk58EbvCS7lqEciirDu83hbAaMWwRF7nOY15poPegLXpKfyd9HzJHI3JdiIMdDwKMZUOVTAgU7G6o7Vt-jegLSaIFQDG9kDuxu1FSgxXvkJoYvrQDwBlZRDg83y2wC2LQC_nm-6iEHVpmZ6zirXaLjsmGVeDQnl0k7dENcxjsQEoQM1jENWGKekBVdlDmSRi2ZGcBWQ2PKG_nhal32hh09ydS-SDwOwZdwx7CV5cV3MUSoihzSkq0q20mYWFZ83Ocq6fkbfnu-5CHo6iLjaM-Nyc5X_a2AtnXG0wgQbbX54kEAABD7x-LH2G5sfzZQrc_ffeiymkzCA <- Ad

https://www.linkedin.com/jobs/search-results/?currentJobId=4321207083&keywords=trust%20and%20safety&distance=25&geoId=90000064&origin=JOBS_HOME_KEYWORD_HISTORY&trackingId=%2FTCAKflbrqPH8HT71iTYLg%3D%3D&refId=CnB64%2BClnH5MoKvlytxUKw%3D%3D&eBP=CwEAAAGanyJoKc3Zn6J70S30fmDPWmxLDwPdoot5zen5djrMovkixRSYZ0PJylWSDEOKbqSrBf6X7EmL3oBNBHYTfGKGJpUo6mK1ig7jsptBO_P0zarjzrpZxH_n2uRDhA8sQY8Ld4Et2y4Ss757lV1u0CIGWYPhusx4l2swmcmbfACzrMXZEP6ahE9OOrtZpOaJ0EDsE3GF-ooCqFej4VIvDttnZ2kyZzD_0URCqkLXa3N4xfJ0hJl1YNNWR8qpG3FOTmRW3T4QzUdev7VtdK4wgO_HORIfs4xh3K45NQWV0SumCvCfIwlxoHB6t13kofM0NGeEOZGEzKynWz_f3Zjjbk0Oh6-435HS60MP0IxtkwD_kG6XKw0NKLv0sIaqE80NShVAinC-co_lT5itOJuxApWcLHNY0mG2eKVxqRAGoSl_qfOUtWdFWfg0O0Z9FzYhKxcbdfB9-QwMrAulEWe9LngrknWLL8kiOJYLz9U0WvSwbBUmnDyfYO_wpGTNsAnfmwNAv10uEg <- ad

https://www.linkedin.com/jobs/search-results/?currentJobId=4318582882&keywords=trust%20and%20safety&distance=25&geoId=90000064&origin=JOBS_HOME_KEYWORD_HISTORY&trackingId=uRxlFBH%2FTC7cWkXddtxlpw%3D%3D&refId=CnB64%2BClnH5MoKvlytxUKw%3D%3D&eBP=NOT_ELIGIBLE_FOR_CHARGING <- Not ad -->

## Git Workflow

- Main branch for PRs: `main`
- Always verify changes before committing
