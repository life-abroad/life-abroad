import os
import uuid
from typing import BinaryIO, Any
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
    
    def _generate_structured_path(self, user_id: int, post_id: int, file_name: str) -> str:
        """Generate a structured path for media files: users/{user_id}/posts/{post_id}/{uuid}.{ext}"""
        file_extension = file_name.split('.')[-1] if '.' in file_name else ''
        unique_id = uuid.uuid4()
        
        if file_extension:
            filename = f"{unique_id}.{file_extension}"
        else:
            filename = str(unique_id)
        
        # Create structured path
        structured_path = f"users/{user_id}/posts/{post_id}/{filename}"
        return structured_path
    
    def upload_file(self, file_data: BinaryIO, file_name: str, content_type: str, 
                    user_id: int | None = None, post_id: int | None = None) -> str:
        """
        Upload a file to MinIO and return the file path.
        If user_id and post_id are provided, files are organized in a structured hierarchy:
        users/{user_id}/posts/{post_id}/{uuid}.{ext}
        Otherwise, files are stored in the root with just {uuid}.{ext}
        """
        try:
            # Generate filename based on whether we have structure info
            if user_id is not None and post_id is not None:
                object_name = self._generate_structured_path(user_id, post_id, file_name)
            else:
                # Fallback to flat structure for backwards compatibility
                file_extension = file_name.split('.')[-1] if '.' in file_name else ''
                object_name = f"{uuid.uuid4()}.{file_extension}" if file_extension else str(uuid.uuid4())
            
            # Upload file
            self.client.put_object(
                bucket_name=self.bucket_name,
                object_name=object_name,
                data=file_data,
                content_type=content_type,
                length=-1,  # Unknown length, MinIO will figure it out
                part_size=10*1024*1024  # 10MB parts
            )
            
            logger.info(f"Uploaded file: {object_name}")
            return object_name
            
        except S3Error as e:
            logger.error(f"Error uploading file: {e}")
            raise
    
    def get_file_stream(self, file_path: str) -> tuple[Any, str, int]:
        """Get a file stream for direct serving"""
        try:
            # Get file info
            stat = self.client.stat_object(self.bucket_name, file_path)
            content_type = stat.content_type or "application/octet-stream"
            content_length = stat.size or 0
            
            # Get file stream
            response = self.client.get_object(self.bucket_name, file_path)
            
            logger.info(f"Streaming file {file_path} ({content_type}, {content_length} bytes)")
            return response, content_type, content_length
            
        except S3Error as e:
            logger.error(f"Error streaming file: {e}")
            raise
    
    def delete_file(self, file_path: str) -> bool:
        """Delete a file from storage"""
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
        """Check if a file exists in storage"""
        try:
            self.client.stat_object(
                bucket_name=self.bucket_name,
                object_name=file_path
            )
            return True
        except S3Error:
            return False
    
    def delete_post_media(self, user_id: int, post_id: int) -> int:
        """Delete all media files for a specific post. Returns count of deleted files."""
        try:
            prefix = f"users/{user_id}/posts/{post_id}/"
            objects = self.client.list_objects(
                bucket_name=self.bucket_name,
                prefix=prefix,
                recursive=True
            )
            
            deleted_count = 0
            for obj in objects:
                if obj.object_name:
                    try:
                        self.client.remove_object(
                            bucket_name=self.bucket_name,
                            object_name=obj.object_name
                        )
                        deleted_count += 1
                        logger.info(f"Deleted file: {obj.object_name}")
                    except S3Error as e:
                        logger.error(f"Error deleting {obj.object_name}: {e}")
            
            logger.info(f"Deleted {deleted_count} files for post {post_id}")
            return deleted_count
            
        except S3Error as e:
            logger.error(f"Error listing files for deletion: {e}")
            return 0
    
    def delete_user_media(self, user_id: int) -> int:
        """Delete all media files for a specific user. Returns count of deleted files."""
        try:
            prefix = f"users/{user_id}/"
            objects = self.client.list_objects(
                bucket_name=self.bucket_name,
                prefix=prefix,
                recursive=True
            )
            
            deleted_count = 0
            for obj in objects:
                if obj.object_name:
                    try:
                        self.client.remove_object(
                            bucket_name=self.bucket_name,
                            object_name=obj.object_name
                        )
                        deleted_count += 1
                        logger.info(f"Deleted file: {obj.object_name}")
                    except S3Error as e:
                        logger.error(f"Error deleting {obj.object_name}: {e}")
            
            logger.info(f"Deleted {deleted_count} files for user {user_id}")
            return deleted_count
            
        except S3Error as e:
            logger.error(f"Error listing files for deletion: {e}")
            return 0
