#include "PCH.h"
#include "PrismaUI_API.h"

namespace AetheriusClassesPlugin {
    static PRISMA_UI_API::IVPrismaUI1* g_prismaUI = nullptr;
    static PrismaView g_view = 0;
    static bool g_isOpen = false;

    // Código DX / ScanCode para tecla 'K'
    constexpr uint32_t KEY_K = 0x25; // 37 in Skyrim DX ScanCode
    constexpr uint32_t KEY_ESC = 0x01; // 1 in Skyrim DX ScanCode

    void ToggleUI() {
        if (!g_prismaUI || !g_view) return;

        if (g_isOpen) {
            g_prismaUI->Unfocus(g_view);
            g_prismaUI->Hide(g_view);
            g_isOpen = false;
            logger::info("Aetherius Classes UI fechada.");
        } else {
            g_prismaUI->Show(g_view);
            g_prismaUI->Focus(g_view, false, false);
            g_isOpen = true;
            logger::info("Aetherius Classes UI aberta.");
        }
    }

    class InputEventHandler : public RE::BSTEventSink<RE::InputEvent*> {
    public:
        static InputEventHandler* GetSingleton() {
            static InputEventHandler singleton;
            return &singleton;
        }

        RE::BSEventNotifyControl ProcessEvent(RE::InputEvent* const* a_event, RE::BSTEventSource<RE::InputEvent*>*) override {
            if (!a_event || !*a_event) {
                return RE::BSEventNotifyControl::kContinue;
            }

            for (auto event = *a_event; event; event = event->next) {
                if (event->eventType == RE::INPUT_EVENT_TYPE::kButton) {
                    auto button = event->AsButtonEvent();
                    if (!button || !button->IsDown()) continue;

                    auto idCode = button->GetIDCode();

                    // Pressionou K
                    if (idCode == KEY_K) {
                        ToggleUI();
                    }
                    // Pressionou ESC quando UI está aberta
                    else if (idCode == KEY_ESC && g_isOpen) {
                        ToggleUI();
                    }
                }
            }

            return RE::BSEventNotifyControl::kContinue;
        }
    };

    void InitializeUI() {
        if (!g_prismaUI) {
            logger::error("PrismaUI API não está disponível para criar a view.");
            return;
        }

        // Caminho relativo a: Data/PrismaUI/views/AetheriusClasses/index.html
        g_view = g_prismaUI->CreateView("AetheriusClasses/index.html", [](PrismaView view) {
            logger::info("Aetherius Classes DOM carregado com sucesso. View ID: {}", view);

            // Inicia oculto até o jogador apertar K
            if (g_prismaUI) {
                g_prismaUI->Hide(view);
            }
        });

        if (!g_view) {
            logger::error("Falha ao criar PrismaView para AetheriusClasses/index.html");
            return;
        }

        // Registra ouvinte de ações JavaScript da interface
        g_prismaUI->RegisterJSListener(g_view, "onClassAction", [](const char* data) {
            logger::info("[PrismaUI JS -> C++] Ação recebida: {}", data ? data : "null");
            // Ações podem ser encaminhadas para a API do SkyMP ou processadas localmente
        });

        // Registra o tratador de eventos de teclado no Skyrim
        if (auto inputDeviceManager = RE::BSInputDeviceManager::GetSingleton()) {
            inputDeviceManager->AddEventSink(InputEventHandler::GetSingleton());
            logger::info("InputEventHandler registrado para a tecla [K].");
        }
    }

    void SKSEMessageHandler(SKSE::MessagingInterface::Message* a_msg) {
        switch (a_msg->type) {
            case SKSE::MessagingInterface::kDataLoaded: {
                logger::info("Skyrim kDataLoaded disparado. Solicitando interface PrismaUI...");
                g_prismaUI = static_cast<PRISMA_UI_API::IVPrismaUI1*>(
                    PRISMA_UI_API::RequestPluginAPI(PRISMA_UI_API::InterfaceVersion::V1)
                );

                if (g_prismaUI) {
                    logger::info("PrismaUI API conectada com sucesso!");
                    InitializeUI();
                } else {
                    logger::warn("PrismaUI não encontrado ou versão incompatível.");
                }
                break;
            }
        }
    }
}

SKSEPluginLoad(const SKSE::LoadInterface* a_skse) {
    SKSE::Init(a_skse);

    auto messaging = SKSE::GetMessagingInterface();
    if (!messaging || !messaging->RegisterListener("SKSE", AetheriusClassesPlugin::SKSEMessageHandler)) {
        return false;
    }

    return true;
}
