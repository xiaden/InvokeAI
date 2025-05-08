import sqlite3

from invokeai.app.services.shared.sqlite_migrator.sqlite_migrator_common import Migration


class Migration21Callback:
    def __call__(self, cursor: sqlite3.Cursor) -> None:
        backup_filename = "style_presets_backup_migration_21.sql"

        with open(backup_filename, "w", encoding="utf-8") as f:
            for row in cursor.execute("SELECT * FROM style_presets"):
                insert_statement = f"INSERT INTO style_presets VALUES ({', '.join(repr(col) for col in row)});\n"
                f.write(insert_statement)

        # 1. Rename the existing table
        cursor.execute("ALTER TABLE style_presets RENAME TO old_style_presets;")

        # 2. Recreate the table with the new fields and FK
        cursor.execute(
            """
            CREATE TABLE style_presets (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                preset_data TEXT NOT NULL,
                type TEXT NOT NULL,
                base_type TEXT DEFAULT NULL,
                model_key TEXT DEFAULT NULL,
                created_at DATETIME NOT NULL DEFAULT(STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
                updated_at DATETIME NOT NULL DEFAULT(STRFTIME('%Y-%m-%d %H:%M:%f', 'NOW')),
                FOREIGN KEY (model_key) REFERENCES models(id) ON DELETE CASCADE
                CHECK (
                    (type = 'model' AND model_key IS NOT NULL) OR
                    (type = 'base' AND base_type IS NOT NULL) OR
                    (type IN ('default', 'user', 'project'))
                )
            );
            """
        )

        # 3. Copy data back
        cursor.execute(
            """
            INSERT INTO style_presets (id, name, preset_data, type, created_at, updated_at)
            SELECT id, name, preset_data, type, created_at, updated_at
            FROM old_style_presets;
            """
        )

        # 4. Drop the old table
        cursor.execute("DROP TABLE old_style_presets;")


def build_migration_21() -> Migration:
    return Migration(
        from_version=20,
        to_version=21,
        callback=Migration21Callback(),
    )
