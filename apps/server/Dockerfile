FROM python:3.12-slim-bookworm

WORKDIR /app

# Optional OS-level deps (enabled via build-arg for Raspberry Pi/production)
ARG WITH_IMAGE_DEPS=0
RUN set -eux; \
    if [ "$WITH_IMAGE_DEPS" = "1" ]; then \
        rm -rf /var/lib/apt/lists/*; \
        apt-get update -o Acquire::Retries=3 -y; \
        DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
            gcc \
            g++ \
            make \
            libffi-dev \
            libjpeg-dev \
            zlib1g-dev \
            libheif-dev \
            libde265-dev \
            libx265-dev \
            pkg-config; \
        rm -rf /var/lib/apt/lists/*; \
    fi

# minimal deps for a single-page FastAPI app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ src/

CMD ["uvicorn", "src.interfaces.http.api:app", "--host", "0.0.0.0", "--port", "8000"]
