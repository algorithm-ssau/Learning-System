# Use official Python image as base
FROM python:3.12

# Set environment variables
ENV APP_HOME=/app

# Set work directory
WORKDIR $APP_HOME

# Copy the rest of the application
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
# Expose the port Uvicorn will run on
EXPOSE 8000
