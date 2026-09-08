class LocationService:

    @staticmethod
    def generate_maps_url(latitude, longitude):
        return (
            f"https://www.google.com/maps?q={latitude},{longitude}"
        )