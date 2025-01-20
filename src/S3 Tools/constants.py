import os
import dotenv
#import

envPath = os.path.join(os.path.dirname(__file__), ".env")
if os.path.exists(envPath):
    print("loading dot env...")
    dotenv.load_dotenv()

AWS_ACCESS_KEY_ID = os.environ["AWS_ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]
AWS_S3_ENDPOINT = os.environ["AWS_S3_ENDPOINT"]
AWS_S3_BUCKET = os.environ["AWS_S3_BUCKET"]

