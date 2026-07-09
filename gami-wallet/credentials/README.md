# App Store credentials (do not commit secrets)

Place App Store Connect API credentials here for automated `eas submit`.

## Required for `eas submit --platform ios`

1. **App Store Connect API key** (`.p8` file)
   - Create at [App Store Connect → Users and Access → Integrations → App Store Connect API](https://appstoreconnect.apple.com/access/integrations/api)
   - Download the `.p8` key once and save as `AuthKey.p8` in this folder
   - Note the **Key ID** and **Issuer ID**

2. Update `eas.json` → `submit.production.ios`:
   - `ascApiKeyId` — your Key ID (e.g. `AB12CD34EF`)
   - `ascApiKeyIssuerId` — your Issuer UUID
   - `ascApiKeyPath` — `./credentials/AuthKey.p8`

## Apple Developer account (already configured)

| Field | Value |
|-------|-------|
| Team ID (App ID Prefix) | `28DWZWQ4YG` |
| Bundle ID | `com.gami.gamiwalletapp` |

## Alternative: App-Specific Password

If you prefer not to use API keys, run interactively:

```bash
eas submit --platform ios --profile production
```

EAS will prompt for your Apple ID and app-specific password.
