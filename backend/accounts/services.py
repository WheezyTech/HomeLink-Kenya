from accounts.models import User


class RegistrationService:

    @staticmethod
    def register(data):

        password = data.pop("password")

        data.pop("confirm_password")

        user = User.objects.create_user(
            password=password,
            **data
        )

        return user