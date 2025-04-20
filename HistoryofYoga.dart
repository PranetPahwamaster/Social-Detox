import '/flutter_flow/flutter_flow_theme.dart';
import '/flutter_flow/flutter_flow_util.dart';
import '/flutter_flow/flutter_flow_widgets.dart';
import '/flutter_flow/flutter_flow_youtube_player.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import 'historyof_yoga_model.dart';
export 'historyof_yoga_model.dart';

class HistoryofYogaWidget extends StatefulWidget {
  const HistoryofYogaWidget({super.key});

  @override
  State<HistoryofYogaWidget> createState() => _HistoryofYogaWidgetState();
}

class _HistoryofYogaWidgetState extends State<HistoryofYogaWidget> {
  late HistoryofYogaModel _model;

  final scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  void initState() {
    super.initState();
    _model = createModel(context, () => HistoryofYogaModel());

    WidgetsBinding.instance.addPostFrameCallback((_) => setState(() {}));
  }

  @override
  void dispose() {
    _model.dispose();

    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return YoutubeFullScreenWrapper(
      child: Scaffold(
        key: scaffoldKey,
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: Colors.white,
          automaticallyImplyLeading: false,
          leading: InkWell(
            splashColor: Colors.transparent,
            focusColor: Colors.transparent,
            hoverColor: Colors.transparent,
            highlightColor: Colors.transparent,
            onTap: () async {
              context.pushNamed('Yoga_1');
            },
            child: Icon(
              Icons.chevron_left_rounded,
              color: Color(0xFF0F1113),
              size: 32,
            ),
          ),
          title: Text(
            'History of Yoga',
            style: FlutterFlowTheme.of(context).headlineMedium.override(
                  fontFamily: 'Outfit',
                  color: Color(0xFF0F1113),
                  fontSize: 24,
                  letterSpacing: 0,
                  fontWeight: FontWeight.w500,
                ),
          ),
          actions: [],
          centerTitle: false,
          elevation: 0,
        ),
        body: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.max,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: EdgeInsetsDirectional.fromSTEB(16, 0, 16, 0),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: EdgeInsetsDirectional.fromSTEB(0, 20, 0, 20),
                      child: FlutterFlowYoutubePlayer(
                        url:
                            'https://www.youtube.com/watch?v=DaRoNwH0rrs&t=753s',
                        autoPlay: false,
                        looping: true,
                        mute: false,
                        showControls: true,
                        showFullScreen: true,
                        strictRelatedVideos: false,
                      ),
                    ),
                    Text(
                      'Origins:\n\n5,000+ years old: First mentions found in ancient Indian texts like the Rig Veda.\nIndus Valley Civilization: Early evidence suggests yoga practices existed in this ancient civilization.\n\nImpact:\n\nPhysical and mental health benefits: Improved flexibility, strength, stress reduction, and mental clarity.\nSpiritual development: Path to self-awareness, inner peace, and connection to something greater.\nCultural phenomenon: Yoga studios, retreats, and teacher trainings thriving worldwide.',
                      style: FlutterFlowTheme.of(context).labelLarge.override(
                            fontFamily: 'Outfit',
                            color: Color(0xFF57636C),
                            fontSize: 20,
                            letterSpacing: 0,
                            fontWeight: FontWeight.w500,
                          ),
                    ),
                    Divider(
                      height: 32,
                      thickness: 1,
                      color: Color(0xFFDBE2E7),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
