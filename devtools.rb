require "json"
require "benchmark"
require "set"

def switch(environment)
    if ENV["DEV_MODE"] == "true"
        Plataforma.setEnv(environment)

        if Plataforma::getEnv == "PROD"
            $DOMINIO_AMBIENTE = "gabster.com.br"
            $AMBIENTE = "plataforma.gabster.com.br"
            $URL_CATALOGO = "catalogogabster.gabster.com.br"
            $URL_VIA2 = "via2.gabster.com.br"
            $URL_HOME = "home.gabster.com.br"
            $URL_TOOLBOX = "toolbox.gabster.com.br"
            $URL_PLAY = "play.gabster.com.br"
            $URL_GENE = "gene.gabster.com.br"
            $URL_API = "rest-api.gabster.com.br"
            $GBSPROTOCOL = "https"
            $AMBIENTE_EXIBICAO = "GABSTER"
            $AWS_S3_PATH = "cdn2.gabster.com.br"
        elsif Plataforma::getEnv == "HML"
            $DOMINIO_AMBIENTE = "gabster.com.br"
            $AMBIENTE = "iamgabster-hml.gabster.com.br"
            $URL_CATALOGO = "catalogoantigo-hml.gabster.com.br"
            $URL_VIA2 = "via2-hml.gabster.com.br"
            $URL_HOME = "home-hml.gabster.com.br"
            $URL_TOOLBOX = "toolbox-hml.gabster.com.br"
            $URL_PLAY = "play-hml.gabster.com.br"
            $URL_GENE = "gene-hml.gabster.com.br"
            $URL_API = "rest-hml.gabster.com.br"
            $GBSPROTOCOL = "https"
            $AMBIENTE_EXIBICAO = "GABSTER HML"
            $AWS_S3_PATH = "bkt-stg-gabster"
        elsif Plataforma::getEnv == "STAGING"
            $DOMINIO_AMBIENTE = "gabster.com.br"
            $AMBIENTE = "iamgabster-staging.gabster.com.br"
            $URL_CATALOGO = "catalogogabster-staging.gabster.com.br"
            $URL_VIA2 = "via2-staging.gabster.com.br"
            $URL_HOME = "home-staging.gabster.com.br"
            $URL_TOOLBOX = "toolbox-staging.gabster.com.br"
            $URL_PLAY = "play-staging.gabster.com.br"
            $URL_GENE = "gene-staging.gabster.com.br"
            $URL_API = "rest-staging.gabster.com.br"
            $GBSPROTOCOL = "https"
            $AMBIENTE_EXIBICAO = "GABSTER STAGING"
            $AWS_S3_PATH = "cdn2.gabster.com.br-v1"
        elsif Plataforma::getEnv == "LOCAL"
            $DOMINIO_AMBIENTE = "localhost"
            $AMBIENTE = "localhost"
            $URL_CATALOGO = "localhost/catalogo/"
            $URL_VIA2 = "via2-hml.gabster.com.br"
            $URL_HOME = "#{Plataforma::getEnv}/home"
            $URL_TOOLBOX = "toolbox-hml.gabster.com.br"
            $URL_PLAY = "localhost/play"
            $URL_GENE = "localhost/gene"
            $URL_API = "localhost/api"
            $GBSPROTOCOL = "http"
            $AMBIENTE_EXIBICAO = "GABSTER LOCAL"
            $AWS_S3_PATH = "bkt-stg-gabster"
        else
            $DOMINIO_AMBIENTE = Plataforma::getEnv + ""
            $AMBIENTE = "#{Plataforma::getEnv}/iam"
            $URL_CATALOGO = "#{Plataforma::getEnv}/catalogo"
            $URL_VIA2 = "#{Plataforma::getEnv}/via2"
            $URL_HOME = "#{Plataforma::getEnv}/home"
            $URL_TOOLBOX = "#{Plataforma::getEnv}/toolbox"
            $URL_PLAY = "#{Plataforma::getEnv}/play"
            $URL_GENE = "#{Plataforma::getEnv}/gene"
            $URL_API = "#{Plataforma::getEnv}/api"
            $GBSPROTOCOL = "http"
            $AMBIENTE_EXIBICAO = "REMOTE: #{Plataforma::getEnv}"
            $AWS_S3_PATH = "cdn2.gabster.com.br"
        end

        $TITLE = "#{Plataforma::Plugin::PLUGIN_NAME} - #{$AMBIENTE_EXIBICAO} #{Plataforma::Plugin::PLUGIN_VERSION}"

        Plataforma::Plugin::Windows::relogin()
        Plataforma::Plugin::Home.init()
    else
        puts "Você não tem permissão."
    end
end

def validate(modulo = nil)
    classes_definidas = ObjectSpace.each_object(Class).to_a
    classes_definidas.select! { |klass| klass.to_s.start_with?(modulo.to_s) } if modulo
    puts classes_definidas
end

def reload(modulo = "**", classe = "*")
    if ENV["DEV_MODE"] == "true"
        path = File.join(Sketchup.find_support_file("Plugins"), "newgabster")
        folders = ["includes", "models", "modules","utils"]
        blacklist = ["file_para_ignorar.rb"]

        folders.each do |folder|
            Dir[File.join(path, folder, "#{modulo}/#{classe}.rb")].each do |file|
                next if blacklist.any? { |blacklisted_file| file.include?(blacklisted_file) }

                print "Reloading #{file}"
                load file
            end
        end

        download = Download.new
        download.getBibliotecas(true)
        G500::download_json
        "Reload completed."
    else
        "Você não tem permissão."
    end
end

def breakpoint(object)
    if ENV["DEV_MODE"] == "true" && Thread.current == Thread.main
        b = object
        puts "\n==============================================================="
        puts("Breakpoint: #{b.inspect} has been found.")
        puts("N. Variables: #{b.local_variables.length}")
        puts "==============================================================="

        b.local_variables.each do |var|
            value = b.local_variable_get(var)
            puts("#{var} = #{value}")
        end

        puts "================================================================\n"

        loop do
            input = UI.inputbox(["Debugger"], [""], "Breakpoint Input")
            break if input == false || input[0].nil? || input[0].empty? || input[0] == "0"

            match = /^(\w+|\w+\[\d+\])\s*=\s*(.+)$/.match(input[0])

            if match
                var = match[1]
                value = match[2]

                begin
                    b.eval("#{var} = #{value}")
                    puts("Target #{var} set to #{value}")
                rescue StandardError => e
                    puts("Error setting #{var} to #{value}: #{e.message}")
                end
            else
                begin
                    result = b.eval(input[0])
                    UI.messagebox("Resultado da expressão: #{result}")
                rescue StandardError => e
                    UI.messagebox("Error validating expressão: #{e.message}")
                end
            end
        end
    end
end

module MyRbLoader
    class ImportDXF
        TOOLBAR_NAME = "G500" unless const_defined?(:TOOLBAR_NAME)
        COMMAND_NAME = "Importar DXFs" unless const_defined?(:COMMAND_NAME)
        GAP = 100.mm

        def self.run
            model = Sketchup.active_model
            ents = model.entities

            folder = UI.select_directory(title: "Escolha a pasta com os arquivos DXF")

            unless folder && File.directory?(folder)
                UI.messagebox("Nenhuma pasta válida foi selecionada.")
                return
            end

            files = Dir.glob(File.join(folder, "*.dxf")).sort

            if files.empty?
                UI.messagebox("Nenhum arquivo .dxf foi encontrado na pasta selecionada.")
                return
            end

            units_options = model.options["UnitsOptions"]
            units_options["LengthUnit"] = 2
            units_options["LengthFormat"] = 0

            model.start_operation("Importar DXFs e explodir", true)

            begin
                x_cursor = 0.0
                imported_count = 0
                failed_files = []

                files.each do |file_path|
                    before = ents.to_a
                    ok = import_dxf(model, file_path)

                    unless ok
                        failed_files << File.basename(file_path)
                        next
                    end

                    after = ents.to_a
                    new_entities = after - before

                    if new_entities.empty?
                        failed_files << File.basename(file_path)
                        next
                    end

                    temp_group = ents.add_group(new_entities)
                    temp_group.name = File.basename(file_path, ".dxf")

                    bb = temp_group.bounds

                    move_vec = Geom::Vector3d.new(
                        x_cursor - bb.min.x,
                        -bb.min.y,
                        -bb.min.z
                    )
                    temp_group.transform!(Geom::Transformation.translation(move_vec))

                    bb2 = temp_group.bounds
                    x_cursor = bb2.max.x + GAP

                    temp_group.explode

                    imported_count += 1
                end

                model.commit_operation

                msg = "Importação concluída.\n\n#{imported_count} arquivo(s) importado(s) e explodidos."
                unless failed_files.empty?
                    msg << "\n\nFalharam:\n- #{failed_files.join("\n- ")}"
                end

                UI.messagebox(msg)
            rescue StandardError => e
                model.abort_operation
                UI.messagebox("Erro durante a importação:\n#{e.message}")
                raise e
            end
        end

        def self.import_dxf(model, file_path)
            begin
                model.import(
                    file_path,
                    {
                        show_summary: false,
                        merge_coplanar_faces: false,
                        orient_faces: true,
                        preserve_origin: true,
                        units: "mm"
                    }
                )
            rescue StandardError
                model.import(file_path, false)
            end
        end
    end

    unless defined?(@g500_import_dxf_loaded) && @g500_import_dxf_loaded
        @g500_import_dxf_loaded = true
    end

    class ClearSelectedMaterials
        def self.run
            model = Sketchup.active_model
            return "Nenhum modelo ativo encontrado." unless model

            selection = model.selection
            return "Selecione ao menos uma face, componente ou grupo." if selection.empty?

            roots = selection.grep(Sketchup::ComponentInstance) + selection.grep(Sketchup::Group)
            faces = selection.grep(Sketchup::Face)

            if roots.empty? && faces.empty?
                return "Selecione ao menos uma face, componente ou grupo."
            end

            visited_defs = Set.new
            cleared_faces = 0

            model.start_operation("Limpar materiais da seleção", true)

            begin
                faces.each do |face|
                    cleared_faces += clear_materials_on_face(face)
                end

                roots.each do |root|
                    cleared_faces += traverse_and_clear_materials(root, visited_defs)
                end

                model.commit_operation
                "Materiais limpos em #{cleared_faces} face(s) da seleção."
            rescue StandardError => e
                model.abort_operation
                "Erro ao limpar materiais da seleção: #{e.message}"
            end
        end

        def self.clear_materials_on_face(face)
            return 0 unless face&.valid?

            changed = 0

            if face.material
                face.material = nil
                changed += 1
            end

            if face.back_material
                face.back_material = nil
                changed += 1
            end

            changed > 0 ? 1 : 0
        end

        def self.clear_materials_in_entities(entities)
            cleared_faces = 0

            entities.grep(Sketchup::Face).each do |face|
                cleared_faces += clear_materials_on_face(face)
            end

            cleared_faces
        end

        def self.traverse_and_clear_materials(instance, visited_defs)
            return 0 unless instance&.valid?
            return 0 unless instance.respond_to?(:definition)

            definition = instance.definition
            return 0 unless definition
            return 0 if visited_defs.include?(definition)

            visited_defs << definition

            cleared_faces = clear_materials_in_entities(definition.entities)

            children = definition.entities.select do |entity|
                entity.is_a?(Sketchup::ComponentInstance) || entity.is_a?(Sketchup::Group)
            end

            children.each do |child|
                cleared_faces += traverse_and_clear_materials(child, visited_defs)
            end

            cleared_faces
        end
    end

    class FindFlaggedComponents
        def self.run
            model = Sketchup.active_model
            return "Nenhum modelo ativo encontrado." unless model

            results = []
            visited = {}

            check_flagged_in_entities(model.entities, results, visited)

            total = results.size
            flagged_results = results.select { |result| result[:flagged_exists] }
            flagged_count = flagged_results.size
            missing_count = total - flagged_count

            puts "\n=== VALIDAÇÃO DO ATRIBUTO gbsflagged ==="
            puts "Total de componentes encontrados: #{total}"
            puts "Com gbsflagged: #{flagged_count}"
            puts "Sem gbsflagged: #{missing_count}"
            puts "========================================\n\n"

            if flagged_results.empty?
                puts "Nenhum componente com gbsflagged foi encontrado."
            else
                flagged_results.each do |result|
                    puts "[OK] #{result[:path]}"
                    puts "     entityID: #{result[:entity_id]} | persistent_id: #{result[:persistent_id]}"
                    puts "     Dictionary: #{result[:dictionary]} | gbsflagged = #{result[:value].inspect}"
                end
            end

            "Validação concluída no Console Ruby. Total: #{total} componente(s), com gbsflagged: #{flagged_count}, sem gbsflagged: #{missing_count}."
        rescue StandardError => e
            "Erro ao procurar por bandeiras: #{e.message}"
        end

        def self.check_flagged_in_entities(entities, results, visited, path = "Model")
            entities.each do |entity|
                next unless entity.is_a?(Sketchup::ComponentInstance) || entity.is_a?(Sketchup::Group)
                next unless entity.valid?

                persistent_id = entity.persistent_id
                next if visited[persistent_id]

                visited[persistent_id] = true

                definition = entity.definition
                definition_name = definition ? definition.name.to_s.strip : ""

                if entity.is_a?(Sketchup::Group)
                    definition_name = "Grupo" if definition_name.empty?
                    current_path = "#{path} > #{definition_name}"

                    if definition && definition.entities
                        check_flagged_in_entities(definition.entities, results, visited, current_path)
                    end

                    next
                end

                definition_name = "Sem nome" if definition_name.empty?
                current_path = "#{path} > #{definition_name}"

                flagged_found = false
                flagged_value = nil
                flagged_dict = nil

                if entity.attribute_dictionaries
                    entity.attribute_dictionaries.each do |dict|
                        next unless dict.keys.include?("gbsflagged")

                        flagged_found = true
                        flagged_value = dict["gbsflagged"]
                        flagged_dict = dict.name
                        break
                    end
                end

                results << {
                    persistent_id: persistent_id,
                    entity_id: entity.entityID,
                    name: definition_name,
                    path: current_path,
                    flagged_exists: flagged_found,
                    dictionary: flagged_dict,
                    value: flagged_value
                }

                if definition && definition.entities
                    check_flagged_in_entities(definition.entities, results, visited, current_path)
                end
            end
        end
    end

    class UpdateDynamicAttributeOnSelection
        def self.run(attribute_name, attribute_value)
            model = Sketchup.active_model
            return "Nenhum modelo ativo encontrado." unless model

            selection = model.selection
            return "Selecione exatamente um componente." unless selection.length == 1
            return "Selecione exatamente um componente." unless selection[0].is_a?(Sketchup::ComponentInstance)

            normalized_attribute_name = attribute_name.to_s
            normalized_attribute_name = normalized_attribute_name.unicode_normalize(:nfkd)
            normalized_attribute_name = normalized_attribute_name.encode("ASCII", replace: "", undef: :replace, invalid: :replace)
            normalized_attribute_name = normalized_attribute_name.downcase
            normalized_attribute_name = normalized_attribute_name.gsub(/\s+/, "_")
            normalized_attribute_name = normalized_attribute_name.gsub(/[^a-z0-9_]/, "")
            normalized_attribute_name = normalized_attribute_name.strip

            return "Informe o nome do atributo." if normalized_attribute_name.empty?

            component_root = selection[0]

            model.start_operation("Alterar Atributos Dinâmicos", true)

            begin
                updated_count = 0

                root_definition = component_root.definition
                if root_definition
                    updated_count += apply_dynamic_attribute_metadata(
                        root_definition,
                        normalized_attribute_name,
                        attribute_value
                    )

                    updated_count += process_entities_recursively(
                        root_definition.entities,
                        normalized_attribute_name,
                        attribute_value
                    )
                end

                model.commit_operation

                "Atributo '#{normalized_attribute_name}' atualizado para '#{attribute_value}' em #{updated_count} entidade(s)."
            rescue StandardError => e
                model.abort_operation
                "Erro ao alterar atributo dinâmico: #{e.message}"
            end
        end

        def self.process_entities_recursively(entities, attribute_name, attribute_value)
            updated_count = 0

            entities.each do |entity|
                next unless entity.is_a?(Sketchup::ComponentInstance) || entity.is_a?(Sketchup::Group)

                definition = entity.respond_to?(:definition) ? entity.definition : nil
                next unless definition

                updated_count += apply_dynamic_attribute_metadata(
                    definition,
                    attribute_name,
                    attribute_value
                )

                updated_count += process_entities_recursively(
                    definition.entities,
                    attribute_name,
                    attribute_value
                )
            end

            updated_count
        end

        def self.apply_dynamic_attribute_metadata(definition, attribute_name, attribute_value)
            dict = definition.attribute_dictionary("dynamic_attributes", true)

            dict[attribute_name] = attribute_value
            dict["_#{attribute_name}_label"] = attribute_name
            dict["_#{attribute_name}_formulaunits"] = "STRING"

            1
        end
    end

    class ClearLocalPluginFiles
        def self.run
            plugins_path = Sketchup.find_support_file("Plugins")
            return "Não foi possível localizar a pasta Plugins do SketchUp." unless plugins_path

            base_path = File.join(plugins_path, "newgabster")
            return "A pasta newgabster não foi encontrada." unless Dir.exist?(base_path)

            deleted_files = []
            skipped_files = []
            errors = []

            targets = [
                {
                    path: File.join(base_path, "skp"),
                    preserve: []
                },
                {
                    path: File.join(base_path, "lib"),
                    preserve: ["gabster.gbs"]
                },
                {
                    path: File.join(base_path, "jsons"),
                    preserve: []
                }
            ]

            targets.each do |target|
                folder_path = target[:path]
                preserve_files = target[:preserve]

                next unless Dir.exist?(folder_path)

                Dir.glob(File.join(folder_path, "**", "*"), File::FNM_DOTMATCH).each do |entry|
                    next if [".", ".."].include?(File.basename(entry))
                    next if File.directory?(entry)

                    if preserve_files.include?(File.basename(entry))
                        skipped_files << entry
                        next
                    end

                    begin
                        File.delete(entry)
                        deleted_files << entry
                    rescue StandardError => e
                        errors << "#{entry} -> #{e.message}"
                    end
                end
            end

            begin
                G500::download_json
                G500::Meddler.verificar_e_processar_json
            rescue StandardError => e
                return "Arquivos locais limpos, mas houve erro ao baixar/processar JSONs: #{e.message}"
            end

            summary = []
            summary << "Limpeza concluída."
            summary << "#{deleted_files.size} arquivo(s) removido(s)."
            summary << "#{skipped_files.size} arquivo(s) preservado(s)." unless skipped_files.empty?
            summary << "#{errors.size} erro(s) durante a exclusão." unless errors.empty?

            unless errors.empty?
                puts "==============================================================="
                puts "Erros durante a limpeza dos arquivos locais:"
                errors.each { |error| puts error }
                puts "==============================================================="
            end

            summary.join(" ")
        rescue StandardError => e
            "Erro ao limpar arquivos locais: #{e.message}"
        end
    end

    if ENV["DEV_MODE"] == "true"
        require "sketchup"
        require "fileutils"
        require "zip"

        def self.carregar(version)
            rbz_path = "#{ENV['RELEASES_FOLDER']}/#{version}.rbz"

            unless File.exist?(rbz_path)
                UI.messagebox("Arquivo #{version}.rbz não encontrado.")
                return
            end

            extract_path = File.join(Sketchup.find_support_file("Plugins"))
            gabster_env_path = File.join(extract_path, "newgabster", "gabster.env")
            temp_env_path = File.join(ENV["RELEASES_FOLDER"], "gabster.env")

            env = false

            if File.exist?(gabster_env_path)
                begin
                    FileUtils.mv(gabster_env_path, temp_env_path)
                    env = true
                rescue StandardError => e
                    UI.messagebox("Erro ao mover gabster.env: #{e.message}")
                    return
                end
            end

            if File.exist?(extract_path)
                begin
                    FileUtils.rm_rf("#{extract_path}/newgabster")
                    FileUtils.rm_rf("#{extract_path}/newgabster.rb")
                rescue StandardError => e
                    UI.messagebox("Erro ao deletar a pasta de destino: #{e.message}")
                    return
                end
            end

            Zip::File.open(rbz_path) do |zip_file|
                zip_file.each do |entry|
                    file_path = File.join(extract_path, entry.name)
                    FileUtils.mkdir_p(File.dirname(file_path))
                    zip_file.extract(entry, file_path) { true }
                end
            end

            if env
                begin
                    FileUtils.mv(temp_env_path, gabster_env_path)
                rescue StandardError => e
                    UI.messagebox("Erro ao mover gabster.env de volta: #{e.message}")
                    return
                end
            end

            UI.messagebox("Plugin instalado com sucesso. Já pode reiniciar o Sketchup.")
        end

        def self.show_dialog
            releases_folder = ENV["RELEASES_FOLDER"]
            rbz_files = Dir.glob("#{releases_folder}/*.rbz").map { |file| File.basename(file, ".rbz") }

            prompts = ["Selecione o arquivo .rbz:"]
            defaults = [rbz_files.first]
            list = [rbz_files.join("|")]

            input = UI.inputbox(prompts, defaults, list, "Carregar Plugin .rbz")

            if input
                version = input.first
                carregar(version)
            end
        end

        unless file_loaded?(__FILE__)
            UI.menu("Plugins").add_item("Carregar Plugin .rbz") {
                show_dialog
            }
            file_loaded(__FILE__)
        end
    end
end

module GabsterDevToolsDialog
    DIALOG_ID = "gabster-devtools".freeze
    DIALOG_TITLE = "Gabster DevTools".freeze

    class << self
        def show_dialog
            return unless ENV["DEV_MODE"] == "true"

            dialog = UI::HtmlDialog.new(
                dialog_title: DIALOG_TITLE,
                preferences_key: DIALOG_ID,
                scrollable: true,
                resizable: false,
                width: 820,
                height: 790,
                min_width: 820,
                min_height: 790,
                style: UI::HtmlDialog::STYLE_DIALOG
            )

            dialog.set_file(html_file_path)
            bind_callbacks(dialog)
            dialog.center
            dialog.show
            @dialog = dialog
        end

        private

        def html_file_path
            File.join(devtools_dist_path, "index.html")
        end

        def devtools_dist_path
            File.join(__dir__, "assets", "dist")
        end

        def bind_callbacks(dialog)
            dialog.add_action_callback("dialogReady") do |_action_context|
                payload = dialog_payload
                dialog.execute_script("window.GabsterReactBridge.render(#{JSON.generate(payload)});")
            end

            dialog.add_action_callback("switchEnvironment") do |_action_context, environment|
                next if environment.to_s.strip.empty?

                switch(environment.to_s)
                payload = dialog_payload
                dialog.execute_script("window.GabsterReactBridge.render(#{JSON.generate(payload)});")
            end

            dialog.add_action_callback("openReleases") do |_action_context|
                MyRbLoader.show_dialog
                payload = dialog_payload
                dialog.execute_script("window.GabsterReactBridge.render(#{JSON.generate(payload)});")
            end

            dialog.add_action_callback("runManualAction") do |_action_context, action_name|
                result = run_manual_action(action_name.to_s)
                dialog.execute_script("window.GabsterReactBridge.showManualActionResult(#{JSON.generate(result.to_s)});")
            end

            dialog.add_action_callback("runReloadAction") do |_action_context, modulo, classe|
                modulo_value = normalize_reload_module(modulo)
                classe_value = normalize_reload_class(classe)

                result = reload(modulo_value, classe_value)
                dialog.execute_script("window.GabsterReactBridge.showManualActionResult(#{JSON.generate(result.to_s)});")
            end

            dialog.add_action_callback("runAdvancedAction") do |_action_context, action_name, id_value|
                payload = run_advanced_action(action_name.to_s, id_value)
                dialog.execute_script("window.GabsterReactBridge.showAdvancedActionResult(#{JSON.generate(payload)});")
            end

            dialog.add_action_callback("toggleReplaceAutomatico") do |_action_context|
                estado_atual = !!G500::ObservadorAtributos.replace_automatico
                G500::ObservadorAtributos.replace_automatico = !estado_atual

                payload = dialog_payload
                dialog.execute_script("window.GabsterReactBridge.render(#{JSON.generate(payload)});")
            end

            dialog.add_action_callback("runDynamicAttributeAction") do |_action_context, attribute_name, attribute_value|
                result = MyRbLoader::UpdateDynamicAttributeOnSelection.run(
                    attribute_name.to_s,
                    attribute_value.to_s
                )
                dialog.execute_script("window.GabsterReactBridge.showManualActionResult(#{JSON.generate(result.to_s)});")
            end
        end

        def run_manual_action(action_name)
            case action_name
            when "validate-plataforma"
                validate("Plataforma")
                "Validate executado no console para o prefixo Plataforma."
            when "clear-flags"
                Plataforma::Tools::Flag.remover_bandeiras
                "Bandeiras Removidas."
            when "import-dxfs"
                MyRbLoader::ImportDXF.run
                "Importação de Dxf's Finalizada"
            when "clear-selected-materials."
                MyRbLoader::ClearSelectedMaterials.run
                "Materiais da Seleção Limpos."
            when "find-flagged-components"
                MyRbLoader::FindFlaggedComponents.run
            when "clear-local-plugin-files"
                MyRbLoader::ClearLocalPluginFiles.run
                "Limpeza dos diretórios locais, corretamente executada."
            else
                "Ação manual não mapeada: #{action_name}"
            end
        rescue StandardError => e
            "Erro ao executar ação manual #{action_name}: #{e.message}"
        end

        def run_advanced_action(action_name, id_value)
            normalized_id = id_value.to_s.strip

            label_map = {
                "meddler-acabamento" => "Request Acabamento",
                "meddler-composicao" => "Request Composição",
                "meddler-peca" => "Request Peça",
                "meddler-modelo" => "Request Modelo",
                "meddler-frente" => "Request Frente",
                "meddler-ferragem" => "Request Ferragem"
            }

            action_label = label_map[action_name] || action_name

            if normalized_id.empty?
                return {
                    success: false,
                    action_name: action_name,
                    action_label: action_label,
                    id: "",
                    result_text: "Informe um ID válido."
                }
            end

            raw_result = case action_name
                        when "meddler-acabamento"
                            G500::Meddler.atributos_por_gbs(normalized_id, :atributos)&.dig(:acabamento)
                        when "meddler-composicao"
                            G500::Meddler.atributos_por_gbs(normalized_id, :atributos)&.dig(:composicao)
                        when "meddler-peca"
                            G500::Meddler.atributos_por_gbs(normalized_id, :atributos)&.dig(:peca)
                        when "meddler-modelo"
                            G500::Meddler.atributos_por_gbs(normalized_id, :modelo)
                        when "meddler-frente"
                            G500::Meddler.atributos_por_gbs(normalized_id, :frente)
                        when "meddler-ferragem"
                            G500::Meddler.atributos_por_gbs(normalized_id, :ferragem)
                        else
                            return {
                                success: false,
                                action_name: action_name,
                                action_label: action_label,
                                id: normalized_id,
                                result_text: "Ação avançada não mapeada: #{action_name}"
                            }
                        end

            formatted_result = case raw_result
                            when Hash, Array
                                JSON.pretty_generate(raw_result)
                            when nil
                                "Nenhum resultado encontrado."
                            else
                                raw_result.inspect
                            end

            puts "==============================================================="
            puts "Ação avançada: #{action_name}"
            puts "ID informado: #{normalized_id}"
            puts "Resultado:"
            puts formatted_result
            puts "==============================================================="

            {
                success: true,
                action_name: action_name,
                action_label: action_label,
                id: normalized_id,
                result_text: formatted_result
            }
        rescue StandardError => e
            not_found_message = "Request não encontrado localmente. Verifique se o componente já foi baixado ou se existe algum problema no endpoint deste ID.\n\nEndpoint: https://catalogogabster.gabster.com.br/api/dinamic_attributes/{id_composicao}/{id_linha}/{id_biblioteca}"

            friendly_message =
                if e.message.to_s.include?("JSON não encontrado para o componente")
                    not_found_message
                else
                    "Erro ao executar a consulta: #{e.message}"
                end

            {
                success: false,
                action_name: action_name,
                action_label: action_label,
                id: normalized_id,
                result_text: friendly_message
            }
        end

        def normalize_reload_module(value)
            normalized = value.to_s.strip
            normalized.empty? ? "**" : normalized
        end

        def normalize_reload_class(value)
            normalized = value.to_s.strip
            normalized.empty? ? "*" : normalized
        end

        def dialog_payload
            {
                title: DIALOG_TITLE,
                current_environment: Plataforma::getEnv.to_s,
                environment_buttons: environment_buttons,
                replace_automatico: !!G500::ObservadorAtributos.replace_automatico
            }
        end

        def environment_buttons
            buttons = [
                { key: "PROD", label: "PROD", action: "switch", environment: "PROD" },
                { key: "HML", label: "HML", action: "switch", environment: "HML" },
                { key: "STAGING", label: "STAGING", action: "switch", environment: "STAGING" },
                { key: "LOCAL", label: "LOCAL", action: "switch", environment: "LOCAL" }
            ]

            if ENV["CUSTOM_IP"] && !ENV["CUSTOM_IP"].to_s.strip.empty?
                buttons << {
                    key: "CUSTOM",
                    label: "CUSTOM",
                    action: "switch",
                    environment: ENV["CUSTOM_IP"].to_s
                }
            end

            buttons << { key: "RELEASES", label: "RELEASES", action: "releases" }
            buttons
        end
    end
end

module DebugBenchmark
    def method_added(method_name)
        return unless ENV["BENCHMARK"] == "true"
        return if @hooked_methods&.include?(method_name)

        @hooked_methods ||= []
        @hooked_methods << method_name

        original_method = instance_method(method_name)

        define_method(method_name) do |*args, &block|
            result = nil
            time = Benchmark.measure do
                result = original_method.bind(self).call(*args, &block)
            end
            puts "[Benchmark] #{self.class}##{method_name} - #{format('%.6f', time.real)} sec."
            result
        end
    end

    def singleton_method_added(method_name)
        return unless ENV["BENCHMARK"] == "true"
        return if @hooked_class_methods&.include?(method_name)

        @hooked_class_methods ||= []
        @hooked_class_methods << method_name

        original_method = singleton_method(method_name)

        define_singleton_method(method_name) do |*args, &block|
            result = nil
            time = Benchmark.measure do
                result = original_method.call(*args, &block)
            end
            puts "[Benchmark] #{self}##{method_name} - #{format('%.6f', time.real)} sec."
            result
        end
    end
end

Object.extend(DebugBenchmark)
Module.prepend(DebugBenchmark)