import { Database } from '@nozbe/watermelondb'
import { synchronize } from '@nozbe/watermelondb/sync'

const token = 'v1-62qxFs2KJXdPaqAIxpSsgLsU8QwvPAJFL7M0NAi0UAXPeUqxijuJEvJdMqfnrMlvKBDqjHWce3HDQpcJ7CgCFsT2O4zD20nbfpODLdxZjZo7zv8PvZVlkFZNSdgeBdafNOdsNCv58OoTauRb53QuPk8cie1';

export async function mySync(database: Database) {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt, schemaVersion, migration }) => {
      const urlParams = `last_pulled_at=${lastPulledAt}&schema_version=${schemaVersion}&migration=${encodeURIComponent(
        JSON.stringify(migration),
      )}`
      const response = await fetch(`http://localhost:20017/api/v1/sync?${urlParams}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'X-App-Silo': 'acme'
        },
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }

      const { changes, timestamp } = await response.json()
      return { changes, timestamp }
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const response = await fetch(`http://localhost:20017/api/v1/sync?last_pulled_at=${lastPulledAt}`, {
        method: 'POST',
        body: JSON.stringify(changes),
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
    },
    migrationsEnabledAtVersion: 1,
  })
}