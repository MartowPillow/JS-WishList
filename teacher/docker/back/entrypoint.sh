if test -f "$DB_PATH"; then
    echo "Database already loaded"
else
    cat /sql/data.sql | sqlite3 $DB_PATH
fi

exec "$@"