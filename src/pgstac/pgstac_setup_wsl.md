
# Setting Up pgstac on WSL

This guide provides step-by-step instructions to set up a pgstac database on Windows Subsystem for Linux (WSL). It covers installing PostgreSQL, PostGIS, pg_partman, and pgstac, along with the necessary configurations and instructions to connect to pgAdmin.

## Prerequisites
- WSL installed on your Windows machine.
- Basic familiarity with the Linux command line.

## Step 1: Open WSL

Start by opening your WSL terminal.

## Step 2: Install PostgreSQL and PostGIS

Install the necessary packages for PostgreSQL and PostGIS:

```sh
sudo apt update
sudo apt install git make gcc postgresql-server-dev-all
sudo apt install postgresql postgresql-contrib
sudo apt install postgis
```

## Step 3: Install pg_partman

pg_partman is required for pgstac. Follow these steps to install it:

```sh
git clone https://github.com/pgpartman/pg_partman.git
cd pg_partman
make
sudo make install
sudo service postgresql start
```

Note: The pg_partman repository requires `make` to be installed.

## Step 4: Set Up PostgreSQL Database

Switch to the PostgreSQL user and create a new database:

```sh
sudo -i -u postgres
createdb stac_test
psql stac_test
```

Within the PostgreSQL shell, enable the required extensions:

```sql
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
CREATE EXTENSION postgis_sfcgal;
CREATE SCHEMA partman;
CREATE EXTENSION pg_partman SCHEMA partman;
SELECT PostGIS_Version();
SELECT * FROM pg_extension WHERE extname = 'pg_partman';
```

Exit the PostgreSQL shell:

```sh
\q
exit
```

## Step 5: Install pgstac with Python

Install pgstac using the `pypgstac` package. Make sure you have `mamba` or `conda` installed to manage Python environments:

```sh
mamba activate stac_tools
python -m pip install pypgstac[psycopg]
python -m pip install pypgstac migrate
```

## Step 6: Configure Environment Variables

Set the necessary PostgreSQL environment variables:

```sh
export PGHOST=localhost
export PGPORT=5432
export PGUSER=postgres
export PGDATABASE=stac_test
export PGPASSWORD=yourpassword
```

## Step 7: Migrate pgstac

Run the `pypgstac migrate` command to set up the pgstac schema:

```sh
pypgstac migrate
```

This command should return the version number, confirming the migration.

## Step 8: Verify the Installation

Connect to the PostgreSQL database and verify the schemas:

```sh
psql -U postgres -d stac_test
\dn
```

You should see the following output:

```
     List of schemas
   Name   |    Owner
----------+--------------
 partman  | postgres
 pgstac   | pgstac_admin
 public   | postgres
 topology | postgres
(4 rows)
```

## Step 9: Configure PostgreSQL for Remote Access (pgAdmin)

### Edit `postgresql.conf`

Open the `postgresql.conf` file in WSL:

```sh
sudo nano /etc/postgresql/13/main/postgresql.conf
```

Find the line `listen_addresses`, uncomment it, and set it to listen on all addresses:

```plaintext
listen_addresses = '*'
```

Save and exit the file (Ctrl + O, Enter, Ctrl + X).

### Edit `pg_hba.conf`

Open the `pg_hba.conf` file in WSL:

```sh
sudo nano /etc/postgresql/13/main/pg_hba.conf
```

Add the following line to allow connections from any IP address with password authentication:

```plaintext
host    all             all             0.0.0.0/0               md5
```

Save and exit the file (Ctrl + O, Enter, Ctrl + X).

### Restart PostgreSQL

Restart the PostgreSQL service to apply the changes:

```sh
sudo service postgresql restart
```

## Step 10: Find WSL IP Address

Find the IP address of WSL:

```sh
ip addr show
```

Look for the IP address associated with `eth0` (it will look something like `172.22.XXX.XXX`).

## Step 11: Configure Firewall on Windows (if needed)

Allow PostgreSQL port through Windows Firewall:

1. Open Windows Defender Firewall.
2. Go to "Advanced settings" and create a new Inbound Rule.
3. Choose "Port" and click "Next".
4. Select "TCP" and enter "5432" (the default PostgreSQL port).
5. Allow the connection and complete the wizard.

## Step 12: Configure pgAdmin 4

Open pgAdmin 4 on Windows.

### Create a New Server Connection

In pgAdmin 4, right-click on "Servers" in the left-hand pane and select "Create" -> "Server...".

### Enter Connection Details

- **General Tab:**
  - Name: Give your connection a name (e.g., WSL PostgreSQL).

- **Connection Tab:**
  - Hostname/address: Enter the WSL IP address you found earlier (e.g., `172.22.XXX.XXX`).
  - Port: `5432`
  - Maintenance database: `postgres` (or your specific database name)
  - Username: `postgres` (or your specific username)
  - Password: Enter the password for the postgres user.

### Save and Connect

Click "Save" to create the connection.

## Conclusion

Your pgstac setup on WSL should now be complete, and you should be able to connect to the PostgreSQL database using pgAdmin on Windows. You can start using the database for your spatial and temporal asset catalog (STAC) requirements.
