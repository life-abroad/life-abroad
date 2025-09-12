import os
import uuid
from typing import BinaryIO
from minio import Minio
from minio.error import S3Error
import logging

from src.utils.env import get_env_var

logger = logging.getLogger(__name__)

class MediaStorageService:
    def __init__(self):
        self.endpoint = get_env_var("MINIO_ENDPOINT")
        self.access_key = get_env_var("MINIO_ACCESS_KEY")
        self.secret_key = get_env_var("MINIO_SECRET_KEY")
        self.bucket_name = get_env_var("MINIO_BUCKET_NAME")
        self.secure = (get_env_var("MINIO_SECURE") or "false").lower() == "true"
        
        # Initialize MinIO client
        self.client = Minio(
            self.endpoint,
            access_key=self.access_key,
            secret_key=self.secret_key,
            secure=self.secure
        )
        
        # Ensure bucket exists
        self._ensure_bucket_exists()
    
    def _ensure_bucket_exists(self):
        """Create bucket if it doesn't exist"""
        try:
            if not self.client.bucket_exists(self.bucket_name):
                self.client.make_bucket(self.bucket_name)
                logger.info(f"Created bucket: {self.bucket_name}")
        except S3Error as e:
            logger.error(f"Error creating bucket: {e}")
            raise
    
    def upload_file(self, file_data: BinaryIO, file_name: str, content_type: str) -> str:
        """
        Upload a file to MinIO and return the file path
        
        Args:
            file_data: Binary file data
            file_name: Original filename
            content_type: MIME type of the file
            
        Returns:
            str: The path/key of the uploaded file in storage
        """
        try:
            # Generate unique filename to avoid conflicts
            file_extension = file_name.split('.')[-1] if '.' in file_name else ''
            unique_filename = f"{uuid.uuid4()}.{file_extension}" if file_extension else str(uuid.uuid4())
            
            # Upload file
            self.client.put_object(
                bucket_name=self.bucket_name,
                object_name=unique_filename,
                data=file_data,
                content_type=content_type,
                length=-1,  # Unknown length, MinIO will figure it out
                part_size=10*1024*1024  # 10MB parts
            )
            
            logger.info(f"Uploaded file: {unique_filename}")
            return unique_filename
            
        except S3Error as e:
            logger.error(f"Error uploading file: {e}")
            raise
    
    def get_file_url(self, file_path: str) -> str:
        """
        Get a presigned URL for accessing a file
        
        Args:
            file_path: The path/key of the file in storage
            
        Returns:
            str: Presigned URL for accessing the file
        """
        try:
            from datetime import timedelta
            # Generate presigned URL (valid for 7 days)
            url = self.client.presigned_get_object(
                bucket_name=self.bucket_name,
                object_name=file_path,
                expires=timedelta(days=7)  # 7 days
            )
            return url
        except S3Error as e:
            logger.error(f"Error generating presigned URL: {e}")
            raise
    
    def delete_file(self, file_path: str) -> bool:
        """
        Delete a file from storage
        
        Args:
            file_path: The path/key of the file in storage
            
        Returns:
            bool: True if successful
        """
        try:
            self.client.remove_object(
                bucket_name=self.bucket_name,
                object_name=file_path
            )
            logger.info(f"Deleted file: {file_path}")
            return True
        except S3Error as e:
            logger.error(f"Error deleting file: {e}")
            return False
    
    def file_exists(self, file_path: str) -> bool:
        """
        Check if a file exists in storage
        
        Args:
            file_path: The path/key of the file in storage
            
        Returns:
            bool: True if file exists
        """
        try:
            self.client.stat_object(
                bucket_name=self.bucket_name,
                object_name=file_path
            )
            return True
        except S3Error:
            return False
